import { Outlet, Link, useLocation } from 'react-router-dom';
import { PenTool, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
    const location = useLocation();

    const steps = [
        { path: '/', label: 'Home', icon: FileText },
        { path: '/test', label: 'SAGE Test', icon: PenTool },
    ];

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-50 font-sans overflow-hidden">
            <header className="bg-white border-b border-slate-200 shrink-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <PenTool size={20} />
                        </div>
                        <span>Digital SAGE</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = location.pathname === step.path;
                            return (
                                <Link
                                    key={step.path}
                                    to={step.path}
                                    className={cn(
                                        "px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-slate-100 text-slate-900"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <Icon size={16} />
                                    {step.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className={cn(
                "flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 min-h-0",
                location.pathname === '/test' ? "flex flex-col overflow-hidden" : "overflow-y-auto"
            )}>
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 py-6 bg-white shrink-0">
                <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Digital SAGE App. Based on SAGE Validity and Normative Data.</p>
                </div>
            </footer>
        </div>
    );
}
