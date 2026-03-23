import React from 'react';

interface SimpleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    disabled?: boolean;
}

export const SimpleButton = ({ children, onClick, variant = 'primary', className = '', disabled }: SimpleButtonProps) => {
    const base = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 duration-200 select-none";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
        ghost: "text-slate-500 hover:text-slate-900"
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
