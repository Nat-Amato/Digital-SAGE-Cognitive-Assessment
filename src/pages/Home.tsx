import { Link } from 'react-router-dom';
import { ArrowRight, PenTool, Brain, ClipboardCheck } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    SAGE <span className="text-indigo-600">Cognitive Test</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Digital platform for the administration of the Self-Administered Gerocognitive Examination.
                    Optimized for use with tablets and stylus.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
                {[
                    { icon: Brain, title: 'Cognitive Assessment', desc: 'Complete test for memory and orientation.' },
                    { icon: PenTool, title: 'Hand Drawing', desc: 'Support for precise input with Apple Pencil or stylus.' },
                    { icon: ClipboardCheck, title: 'Automatic Scoring', desc: 'Evaluation algorithm based on validated norms.' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                            <item.icon size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <Link
                    to="/test"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-200"
                >
                    Start the Test
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
