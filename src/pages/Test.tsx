import React, { useState } from 'react';
import DrawingCanvas, { type DrawingCanvasRef } from '../components/DrawingCanvas';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sageTestSteps } from '../data/testSteps';
import HybridInput from '../components/HybridInput';
import { calculateSAGEScore, type ScoringResult } from '../utils/sageScoring';
import { SageReview } from '../components/SageReview';
import { SimpleButton } from '../components/SimpleButton';

// Utility for formatted text (bolding)
const FormattedText = ({ text }: { text: string }) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export default function Test() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const canvasRef = React.useRef<DrawingCanvasRef>(null);

    const step = sageTestSteps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === sageTestSteps.length - 1;
    const progress = ((currentStepIndex + 1) / sageTestSteps.length) * 100;

    const [direction, setDirection] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [scoreData, setScoreData] = useState<ScoringResult | null>(null);

    const updateAnswer = (key: string, value: any) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        // Capture drawing if current step has one
        if (step.type === 'clock' && canvasRef.current) {
            const dataUrl = canvasRef.current.getDataUrl();
            updateAnswer('clock_drawing', dataUrl);
        }

        if (step.type === 'copy_drawing' && canvasRef.current) {
            const dataUrl = canvasRef.current.getDataUrl();
            updateAnswer('cube_drawing', dataUrl);
        }

        if (step.type === 'trail_making' && canvasRef.current) {
            const dataUrl = canvasRef.current.getDataUrl();
            updateAnswer('trail_making', dataUrl);
        }

        if (step.type === 'problem_solving' && canvasRef.current) {
            const dataUrl = canvasRef.current.getDataUrl();
            updateAnswer('problem_solving', dataUrl);
        }

        if (isLastStep) {
            handleSubmit();
        } else {
            setDirection(1);
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (isFirstStep) return;
        setDirection(-1);
        setCurrentStepIndex(prev => prev - 1);
    };

    const handleSubmit = () => {
        const score = calculateSAGEScore(answers);
        setScoreData(score);
        setIsCompleted(true);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 20 : -20,
            opacity: 0
        })
    };

    if (isCompleted && scoreData) {
        return <SageReview scoreData={scoreData} answers={answers} />;
    }

    return (
        <div className="w-full h-full bg-white flex flex-col overflow-hidden z-30 shadow-xl rounded-xl border border-slate-200">
            {/* Persistent Header */}
            <div className="p-4 md:p-6 pb-2 shrink-0 bg-white border-b border-slate-100 z-10">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                        <span>SAGE Questionnaire</span>
                        <span>Step {currentStepIndex + 1} of {sageTestSteps.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 w-full relative min-h-0">
                <div className="absolute inset-x-0 top-0 bottom-4 overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-8">
                        <AnimatePresence mode='wait' custom={direction}>
                            <motion.div
                                key={step.id}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="flex flex-col w-full"
                            >
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
                                        {step.description && (
                                            <p className="text-slate-500 mt-1 whitespace-pre-line">
                                                <FormattedText text={step.description} />
                                            </p>
                                        )}
                                    </div>

                                    {/* Single Image handling (Legacy support) */}
                                    {step.image && step.type !== 'copy_drawing' && (
                                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center space-y-4">
                                            <p className="font-medium text-indigo-900">Observe this image</p>
                                            <div className="h-48 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-200 text-indigo-300">
                                                <img src={step.image} className="max-h-full object-contain" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Multiple Images handling for Naming task */}
                                    {step.images && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {step.images.map((img, idx) => (
                                                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                                                    <div className="bg-white rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden p-4 h-64 w-full relative">
                                                        <img
                                                            src={img.src}
                                                            alt={img.label}
                                                            className="max-h-full max-w-full object-contain mx-auto"
                                                        />
                                                    </div>
                                                    <HybridInput
                                                        label={img.label}
                                                        value={answers[img.key] || ''}
                                                        onChange={(val) => updateAnswer(img.key, val)}
                                                        placeholder="Write the name..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {step.fields && (
                                        <div className="grid gap-6">
                                            {step.fields.map(field => (
                                                <HybridInput
                                                    key={field.key}
                                                    label={field.label}
                                                    type={field.type as any}
                                                    value={answers[field.key] || ''}
                                                    onChange={(val) => updateAnswer(field.key, val)}
                                                    options={field.options}
                                                    placeholder={field.placeholder}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {step.type === 'clock' && (
                                        <div className="flex-1 flex flex-col min-h-[400px]">
                                            <div className="flex justify-end mb-2" />
                                            <DrawingCanvas
                                                ref={canvasRef}
                                                height={500}
                                                className="shadow-inner bg-slate-50/50 flex-1 w-full"
                                                initialImage={answers['clock_drawing'] as string}
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    onClick={() => canvasRef.current?.clear()}
                                                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                        </div>
                                    )}


                                    {step.type === 'copy_drawing' && (
                                        <div className="flex-1 flex flex-col gap-4 min-h-[500px]">
                                            <div className="w-full flex justify-center">
                                                <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center w-full max-w-sm">
                                                    <img
                                                        src={step.image}
                                                        alt="Drawing to copy"
                                                        className="w-48 h-48 object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col w-full">
                                                <DrawingCanvas
                                                    ref={canvasRef}
                                                    height={400}
                                                    className="shadow-inner bg-slate-50/50 flex-1 w-full border border-slate-200 rounded-xl"
                                                    initialImage={answers['cube_drawing'] as string}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => canvasRef.current?.clear()}
                                                        className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step.type === 'trail_making' && (
                                        <div className="flex-1 flex flex-col gap-4 w-full h-full overflow-hidden">
                                            {/* --- EXAMPLE SECTION (Top) --- */}
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <div className="relative w-full h-[200px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
                                                    {/* Static Lines */}
                                                    {step.examplePath && step.exampleNodes && (
                                                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                                            {step.examplePath.map((path, i) => {
                                                                const fromNode = step.exampleNodes?.find(n => n.id === path.from);
                                                                const toNode = step.exampleNodes?.find(n => n.id === path.to);
                                                                if (!fromNode || !toNode) return null;
                                                                return (
                                                                    <line
                                                                        key={i}
                                                                        x1={`${fromNode.x}%`}
                                                                        y1={`${fromNode.y}%`}
                                                                        x2={`${toNode.x}%`}
                                                                        y2={`${toNode.y}%`}
                                                                        stroke="#3b82f6" // Blue-500
                                                                        strokeWidth="2"
                                                                    />
                                                                );
                                                            })}
                                                        </svg>
                                                    )}
                                                    {/* Nodes */}
                                                    {step.exampleNodes?.map((node) => (
                                                        <div
                                                            key={node.id}
                                                            className="absolute w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center bg-white text-slate-700 font-bold text-sm shadow-sm z-10"
                                                            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                                                        >
                                                            {node.label}
                                                            {node.subLabel && (
                                                                <span className="absolute -bottom-5 text-[10px] font-normal text-slate-400 whitespace-nowrap uppercase tracking-wider">{node.subLabel}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <div className="absolute top-2 left-2 bg-blue-50/80 px-2 py-1 rounded text-[10px] font-semibold text-blue-700 uppercase tracking-widest border border-blue-100 backdrop-blur-sm">
                                                        Example
                                                    </div>
                                                </div>
                                            </div>

                                            {/* --- TEST SECTION (Bottom) --- */}
                                            <div className="flex-1 flex flex-col min-h-[350px] relative">
                                                <div className="relative w-full h-[380px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-inner group">
                                                    {/* Background Nodes for Test */}
                                                    {step.nodes?.map((node) => (
                                                        <div
                                                            key={node.id}
                                                            className="absolute w-10 h-10 rounded-full border-2 border-slate-400 flex items-center justify-center bg-white text-slate-800 font-bold text-base shadow-sm z-20 pointer-events-none select-none group-hover:border-slate-500 transition-colors"
                                                            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                                                        >
                                                            {node.label}
                                                            {node.subLabel && (
                                                                <span className="absolute -bottom-6 text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider bg-white/50 px-1 rounded">{node.subLabel}</span>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Interactive Canvas Layer - Must be transparent */}
                                                    <DrawingCanvas
                                                        ref={canvasRef}
                                                        height={380}
                                                        className="absolute inset-0 w-full h-full z-10 bg-transparent"
                                                        initialImage={answers['trail_making'] as string}
                                                    />
                                                </div>
                                                <div className="flex justify-end pt-1">
                                                    <button
                                                        onClick={() => canvasRef.current?.clear()}
                                                        className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step.type === 'problem_solving' && (
                                        <div className="flex-1 flex flex-col gap-4 w-full h-full overflow-hidden -mt-8">
                                            {/* --- EXAMPLE SECTION (Top) --- */}
                                            <div className="flex flex-col gap-4 shrink-0">
                                                <div className="flex items-start justify-center gap-4 pb-2">
                                                    {step.exampleFigures?.map((fig, idx) => (
                                                        <React.Fragment key={idx}>
                                                            {idx > 0 && (
                                                                <div className="h-[120px] flex items-center justify-center shrink-0">
                                                                    <ArrowRight className="text-slate-400" size={24} />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col gap-1 shrink-0 w-[200px]">
                                                                <div className="relative w-full h-[120px] flex items-center justify-center">
                                                                    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full p-2">
                                                                        {fig.lines.map((line, i) => {
                                                                            // Calculate midpoint for cross if needed
                                                                            const mx = (line.x1 + line.x2) / 2;
                                                                            const my = (line.y1 + line.y2) / 2;
                                                                            const d = 3; // Size of cross arm

                                                                            return (
                                                                                <g key={i}>
                                                                                    <line
                                                                                        x1={line.x1}
                                                                                        y1={line.y1}
                                                                                        x2={line.x2}
                                                                                        y2={line.y2}
                                                                                        stroke={line.isSolution ? "#22c55e" : "#0f172a"}
                                                                                        strokeWidth={line.isSolution ? "3" : "2"}
                                                                                        strokeDasharray={line.isSolution ? "5,5" : "0"}
                                                                                        strokeLinecap="round"
                                                                                    />
                                                                                    {line.crossedOut && (
                                                                                        <g stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                                                                                            <line x1={mx - d} y1={my - d} x2={mx + d} y2={my + d} />
                                                                                            <line x1={mx + d} y1={my - d} x2={mx - d} y2={my + d} />
                                                                                        </g>
                                                                                    )}
                                                                                </g>
                                                                            );
                                                                        })}

                                                                        {/* Arrows for instructions */}
                                                                        {fig.arrows?.map((arrow, i) => {
                                                                            let transform = '';
                                                                            switch (arrow.direction) {
                                                                                case 'up': transform = `rotate(180, ${arrow.x}, ${arrow.y})`; break;
                                                                                case 'left': transform = `rotate(90, ${arrow.x}, ${arrow.y})`; break;
                                                                                case 'right': transform = `rotate(-90, ${arrow.x}, ${arrow.y})`; break;
                                                                                // down is default (0 rotation if the arrow points down by default)
                                                                            }

                                                                            return (
                                                                                <g key={`arrow-${i}`} transform={transform}>
                                                                                    {/* Simple arrow pointing down */}
                                                                                    <line x1={arrow.x} y1={arrow.y - 8} x2={arrow.x} y2={arrow.y} stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                                                                    <defs>
                                                                                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                                                            <path d="M0,0 L6,3 L0,6" fill="#0f172a" />
                                                                                        </marker>
                                                                                    </defs>
                                                                                    {/* Use a polygon/path manually instead of marker for better control in React SVG */}
                                                                                    <path
                                                                                        d={`M${arrow.x},${arrow.y} L${arrow.x - 3},${arrow.y - 4} L${arrow.x + 3},${arrow.y - 4} Z`}
                                                                                        fill="#0f172a"
                                                                                    />
                                                                                </g>
                                                                            );
                                                                        })}
                                                                    </svg>
                                                                </div>
                                                                <div className="text-center flex flex-col items-center -mt-4">
                                                                    {fig.label && (
                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight mb-1">
                                                                            {fig.label}
                                                                        </span>
                                                                    )}
                                                                    <div
                                                                        className="font-medium text-xs text-slate-900 leading-tight flex flex-col items-center"
                                                                        dangerouslySetInnerHTML={{ __html: fig.caption }}
                                                                    />
                                                                    {fig.subCaption && (
                                                                        <div
                                                                            className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight mt-1"
                                                                            dangerouslySetInnerHTML={{ __html: fig.subCaption }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="text-slate-500 mt-1">
                                                <FormattedText text="Given 3 lines forming a triangle and 4 lines forming a square, clear the lines and draw new ones to form a single large square." />
                                            </div>

                                            {/* --- TEST SECTION (Bottom) --- */}
                                            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-4 w-full mt-4">

                                                {/* LEFT: Static Description */}
                                                <div className="flex flex-col gap-2 shrink-0 w-[140px]">
                                                    <div className="relative w-full h-[180px] flex items-center justify-center shrink-0">
                                                        <svg viewBox="10 5 80 80" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-w-full">
                                                            {step.problemLines?.map((line, i) => (
                                                                <line
                                                                    key={i}
                                                                    x1={line.x1}
                                                                    y1={line.y1}
                                                                    x2={line.x2}
                                                                    y2={line.y2}
                                                                    stroke="#0f172a"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    vectorEffect="non-scaling-stroke"
                                                                />
                                                            ))}
                                                        </svg>
                                                    </div>
                                                    <p className="text-center text-xs font-medium text-slate-900 -mt-2">
                                                        2 squares and 2 triangles
                                                    </p>
                                                </div>

                                                {/* ARROW 1 */}
                                                <div className="h-[180px] flex items-center justify-center shrink-0 w-8">
                                                    <ArrowRight className="text-slate-400 hidden md:block" size={24} />
                                                    <ArrowRight className="text-slate-400 rotate-90 md:hidden" size={24} />
                                                </div>

                                                {/* CENTER: Static Task Description */}
                                                <div className="flex flex-col gap-2 shrink-0 w-[140px]">
                                                    <div className="relative w-full h-[180px] flex items-center justify-center shrink-0">
                                                        <svg viewBox="10 5 80 80" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-w-full">
                                                            {step.problemLines?.map((line, i) => (
                                                                <line
                                                                    key={i}
                                                                    x1={line.x1}
                                                                    y1={line.y1}
                                                                    x2={line.x2}
                                                                    y2={line.y2}
                                                                    stroke="#0f172a"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    vectorEffect="non-scaling-stroke"
                                                                />
                                                            ))}
                                                        </svg>
                                                    </div>
                                                    <div className="text-center flex flex-col items-center -mt-2">
                                                        <span className="text-xs font-medium text-slate-900">Move 4 lines</span>
                                                        <span className="text-[10px] text-slate-500">(mark them with a cross)</span>
                                                    </div>
                                                </div>

                                                {/* ARROW 2 */}
                                                <div className="h-[180px] flex items-center justify-center shrink-0 w-8">
                                                    <ArrowRight className="text-slate-400 hidden md:block" size={24} />
                                                    <ArrowRight className="text-slate-400 rotate-90 md:hidden" size={24} />
                                                </div>

                                                {/* RIGHT: Interactive Drawing Area (Boxed) */}
                                                <div className="flex flex-col gap-2 shrink-0 w-[280px] md:w-[230px] lg:w-[300px]">
                                                    <div className="relative w-full h-[180px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm group">
                                                        {/* Interactive Canvas - Transparent */}
                                                        <DrawingCanvas
                                                            ref={canvasRef}
                                                            height={180}
                                                            className="absolute inset-0 w-full h-full z-10 bg-white"
                                                            initialImage={answers['problem_solving'] as string}
                                                        />
                                                    </div>

                                                    {/* Caption OUTSIDE (Aligned with others) */}
                                                    <div className="text-center flex flex-col items-center -mt-2">
                                                        <span className="text-xs font-medium text-slate-900">Draw the answer here</span>
                                                        <span className="text-[10px] text-slate-500">4 squares</span>
                                                    </div>

                                                    {/* Cancella Button */}
                                                    <div className="flex justify-end pt-1">
                                                        <button
                                                            onClick={() => canvasRef.current?.clear()}
                                                            className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Persistent Footer Area containing Navigation and Copyright */}
            <div className="shrink-0 bg-white border-t border-slate-100 z-20">
                <div className="max-w-3xl mx-auto w-full flex flex-col">
                    {/* Navigation Buttons */}
                    <div className="px-4 py-1 md:px-6 md:py-2 flex justify-between items-center">
                        <SimpleButton
                            variant="ghost"
                            onClick={handlePrev}
                            className={isFirstStep ? 'invisible' : ''}
                        >
                            <ArrowLeft size={18} />
                            Back
                        </SimpleButton>
                        <SimpleButton
                            variant="primary"
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Submit Results' : 'Continue'}
                            <ArrowRight size={18} className={isLastStep ? 'hidden' : ''} />
                        </SimpleButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
