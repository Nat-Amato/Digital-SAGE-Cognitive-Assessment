import React from 'react';
import { SimpleButton } from './SimpleButton';
import { Header } from './Header';
import type { ScoringResult } from '../utils/sageScoring';

import { sageTestSteps } from '../data/testSteps';

interface SageReviewProps {
    scoreData: ScoringResult;
    answers: Record<string, any>;
}

export const SageReview: React.FC<SageReviewProps> = ({ scoreData, answers }) => {
    // Local state for scoring to allow manual edits
    const [currentScore, setCurrentScore] = React.useState<ScoringResult>(scoreData);

    // Update total and classification whenever domains change
    React.useEffect(() => {
        const calculateTotal = () => {
            const d = currentScore.domains;
            // Sum of all current scores (default to 0 if null)
            const rawSum = (d.orientation.score || 0) +
                (d.language.score || 0) +
                (d.memory.score || 0) +
                (d.reasoning.score || 0) +
                (d.visuospatial.score || 0) +
                (d.executive.score || 0);

            // Cap total at 22 (though officially max is 22 regardless of adjustment, usually adjustment is part of obtaining the score)
            // But SAGE rules say: "Total Max = 22".
            // We add adjustment.
            const total = rawSum + currentScore.demographicAdjustment;
            // Ensure it doesn't exceed 22 if that's a hard rule, but usually it's just the max obtainable. 
            // We'll leave it as calculated.

            let classification = "Normal";
            if (total <= 14) classification = "Probable Dementia";
            else if (total <= 16) classification = "Probable MCI / Dementia";

            return { total, classification };
        };

        const { total, classification } = calculateTotal();

        if (total !== currentScore.totalScore || classification !== currentScore.classification) {
            setCurrentScore(prev => ({
                ...prev,
                totalScore: total,
                classification: classification
            }));
        }
    }, [currentScore.domains, currentScore.demographicAdjustment]);

    const handleScoreChange = (domain: keyof ScoringResult['domains'], value: string) => {
        const numVal = parseInt(value) || 0;
        // Clamp between 0 and max
        const max = currentScore.domains[domain].max;
        const clamped = Math.min(Math.max(numVal, 0), max);

        setCurrentScore(prev => ({
            ...prev,
            domains: {
                ...prev.domains,
                [domain]: {
                    ...prev.domains[domain],
                    score: clamped
                }
            }
        }));
    };

    const handleDownload = () => {
        // Use currentScore instead of initial scoreData
        const json = JSON.stringify({ answers, score: currentScore }, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sage_results_${Date.now()}.json`;
        a.click();
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
            <Header title="SAGE Test Results" />
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Scoring Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Score Evaluation</h2>
                                <p className="text-sm text-slate-500">Enter manual scores to calculate the total.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-500 font-medium">SAGE Total</div>
                                <div className="text-4xl font-extrabold text-indigo-600">{currentScore.totalScore} <span className="text-xl text-slate-400 font-normal">/ 22</span></div>
                                <div className={`text-sm font-bold mt-1 px-2 py-1 rounded-full inline-block ${currentScore.classification === 'Normal' ? 'bg-green-100 text-green-700' :
                                    currentScore.classification === 'Probable Dementia' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {currentScore.classification}
                                </div>
                            </div>
                        </div>

                        {/* Domain Inputs Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Adjustment (Read Only) */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                                <span className="font-semibold text-slate-700">Adjustment (Age/Edu)</span>
                                <div className="text-2xl font-bold text-slate-800 mt-2">+{currentScore.demographicAdjustment}</div>
                                <span className="text-xs text-slate-400 mt-1">Automatic</span>
                            </div>

                            {/* Domains */}
                            {Object.entries(currentScore.domains).map(([key, data]) => (
                                <div key={key} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <label className="font-semibold text-slate-700 capitalize">
                                            {key === 'visuospatial' ? 'Visuospatial' :
                                                key === 'reasoning' ? 'Reasoning' :
                                                    key === 'executive' ? 'Executive' :
                                                        key === 'orientation' ? 'Orientation' :
                                                            key === 'language' ? 'Language' :
                                                                key === 'memory' ? 'Memory' : key}
                                        </label>
                                        <span className="text-xs font-mono text-slate-400">Max: {data.max}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max={data.max}
                                            value={data.score ?? ''}
                                            onChange={(e) => handleScoreChange(key as any, e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-lg font-bold text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    {data.auto && (
                                        <span className="text-[10px] text-indigo-500 font-medium uppercase tracking-wide">Suggested: {scoreData.domains[key as keyof typeof scoreData.domains].score}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Drawing Review</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {answers['clock_drawing'] && (
                                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-semibold text-slate-700 text-sm">Clock</p>
                                        <span className="text-[10px] text-slate-400">Visuospatial / Executive</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                                        <img src={answers['clock_drawing'] as string} className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>
                            )}
                            {answers['cube_drawing'] && (
                                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-semibold text-slate-700 text-sm">Cube</p>
                                        <span className="text-[10px] text-slate-400">Visuospatial</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                                        <img src={answers['cube_drawing'] as string} className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>
                            )}
                            {answers['trail_making'] && (
                                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-semibold text-slate-700 text-sm">Trail</p>
                                        <span className="text-[10px] text-slate-400">Executive</span>
                                    </div>
                                    <div className="relative w-full h-48 bg-white border border-slate-200 rounded-lg overflow-hidden">
                                        {/* Background Nodes */}
                                        {sageTestSteps.find(s => s.type === 'trail_making')?.nodes?.map((node) => (
                                            <div
                                                key={node.id}
                                                className="absolute w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center bg-white text-slate-800 font-bold text-[10px] shadow-sm z-0 pointer-events-none select-none"
                                                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                                            >
                                                {node.label}
                                            </div>
                                        ))}
                                        {/* User Drawing Overlay */}
                                        <img
                                            src={answers['trail_making'] as string}
                                            className="absolute inset-0 w-full h-full object-fill z-10"
                                        />
                                    </div>
                                </div>
                            )}
                            {answers['problem_solving'] && (
                                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-semibold text-slate-700 text-sm">Problem</p>
                                        <span className="text-[10px] text-slate-400">Visuospatial / Reasoning</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                                        <img src={answers['problem_solving'] as string} className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 pb-8 print:hidden">
                        <SimpleButton onClick={handleDownload} variant="outline">
                            Download JSON Report
                        </SimpleButton>
                        <SimpleButton onClick={() => window.print()}>
                            Print / PDF
                        </SimpleButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
