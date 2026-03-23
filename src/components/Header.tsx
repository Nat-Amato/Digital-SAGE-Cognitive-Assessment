import React from 'react';

export const Header = ({ title }: { title: string }) => {
    return (
        <div className="p-4 md:p-6 pb-2 shrink-0 bg-white border-b border-slate-100 z-10 w-full">
            <div className="max-w-3xl mx-auto w-full">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>{title}</span>
                </div>
            </div>
        </div>
    );
};
