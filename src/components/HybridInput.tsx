import { useState, useRef, useEffect } from 'react';
import { PenTool, Keyboard, Calendar, X, Check } from 'lucide-react';
import DrawingCanvas, { type DrawingCanvasRef } from './DrawingCanvas';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface HybridInputProps {
    label: string;
    value: string | any;
    onChange: (value: any) => void;
    type?: 'text' | 'number' | 'date' | 'select';
    options?: string[];
    placeholder?: string;
    className?: string;
}

export default function HybridInput({
    label,
    value,
    onChange,
    type = 'text',
    options,
    placeholder,
    className
}: HybridInputProps) {
    const [mode, setMode] = useState<'input' | 'draw'>('input');
    const canvasRef = useRef<DrawingCanvasRef>(null);
    const [hasDrawing, setHasDrawing] = useState(false);

    // If value looks like a data URL, we assume it's a drawing
    useEffect(() => {
        if (typeof value === 'string' && value.startsWith('data:image')) {
            setMode('draw');
            setHasDrawing(true);
        }
    }, []);

    const handleCanvasDraw = () => {
        setHasDrawing(true);
    };

    const confirmDrawing = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.getDataUrl();
            onChange(dataUrl);
        }
    };

    const clearDrawing = () => {
        canvasRef.current?.clear();
        setHasDrawing(false);
        onChange(''); // Clear value
    };

    const switchToInput = () => {
        setMode('input');
        onChange(''); // Reset value to empty string for typing? Or keep it?
    };

    const switchToDraw = () => {
        setMode('draw');
        onChange(''); // Clear text value to prepare for drawing
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">{label}</label>

                {/* Toggle Controls */}
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                    <button
                        onClick={switchToInput}
                        className={cn(
                            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs font-medium",
                            mode === 'input' ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"
                        )}
                        title="Use Keyboard"
                    >
                        <Keyboard size={14} />
                    </button>
                    <button
                        onClick={switchToDraw}
                        className={cn(
                            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs font-medium",
                            mode === 'draw' ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"
                        )}
                        title="Use Pen"
                    >
                        <PenTool size={14} />
                    </button>
                </div>
            </div>

            <div className="relative group">
                {mode === 'input' ? (
                    <div className="relative">
                        {type === 'select' ? (
                            <div className="relative">
                                <select
                                    value={typeof value === 'string' && !value.startsWith('data:image') ? value : ''}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="w-full p-3 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none bg-white font-medium text-slate-700 h-[50px]"
                                >
                                    <option value="" disabled>Select...</option>
                                    {options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <span className="text-xs mr-1">▼</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type={type}
                                    value={typeof value === 'string' && !value.startsWith('data:image') ? value : ''}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-[50px] font-medium text-slate-700"
                                    style={type === 'date' ? { lineHeight: '1.2' } : {}} // Ensure date aligns
                                />
                                {type === 'date' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-white pl-2">
                                        <Calendar size={18} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative border-2 border-indigo-100 rounded-lg bg-slate-50/50 overflow-hidden"
                    >
                        <DrawingCanvas
                            ref={canvasRef}
                            height={100} // Compact height for input replacement
                            className="border-none bg-transparent"
                            onDraw={handleCanvasDraw}
                            initialImage={typeof value === 'string' && value.startsWith('data:image') ? value : undefined}
                            hideLabel
                        />

                        {/* Drawing Actions Overlay - Moved to avoid overlap */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <button
                                onClick={clearDrawing}
                                className="p-1 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded shadow-sm border border-slate-200 transition-colors"
                                title="Clear"
                            >
                                <X size={14} />
                            </button>
                            <button
                                onClick={confirmDrawing}
                                className={cn(
                                    "p-1 rounded shadow-sm border transition-colors",
                                    hasDrawing
                                        ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                                        : "bg-white/80 text-slate-300 border-slate-200 cursor-not-allowed"
                                )}
                                disabled={!hasDrawing}
                                title="Confirm Drawing"
                            >
                                <Check size={14} />
                            </button>
                        </div>

                        {/* Visual indicator - Moved to Bottom LEFT to avoid X/V buttons */}
                        <div className="absolute bottom-1 left-2 text-[10px] text-indigo-300 pointer-events-none uppercase tracking-wider font-bold select-none">
                            Handwriting
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
