import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface DrawingCanvasProps {
    className?: string;
    width?: number; // Optional fixed width
    height?: number; // Optional fixed height
    onDraw?: () => void;
    hideLabel?: boolean;
    initialImage?: string;
}

export interface DrawingCanvasRef {
    clear: () => void;
    getDataUrl: () => string;
    isEmpty: () => boolean;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
    ({ className, width, height, onDraw, hideLabel, initialImage }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const contextRef = useRef<CanvasRenderingContext2D | null>(null);
        const hasDrawn = useRef(false);

        // Initialize canvas
        useEffect(() => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // Function to re-init canvas config
            const initContext = (context: CanvasRenderingContext2D, dpr: number) => {
                context.scale(dpr, dpr);
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.strokeStyle = '#000000';
                context.lineWidth = 3;
            };

            const handleResize = () => {
                // Measure the container's visual size
                // If container is hidden or 0, this might happen during animations.
                const { clientWidth, clientHeight } = container;

                if (clientWidth === 0 || clientHeight === 0) return;

                const displayWidth = width || clientWidth;
                // Ensure we default to a reasonable height if 0 (e.g. flexbox issue)
                const displayHeight = height || (width ? undefined : clientHeight) || 400;

                const dpr = window.devicePixelRatio || 1;

                // Check if we need to resize
                // Comparing with tolerance to avoid loops
                if (canvas.width === displayWidth * dpr && canvas.height === displayHeight * dpr) {
                    return;
                }

                // Save content
                let tempCanvas: HTMLCanvasElement | null = null;
                if (hasDrawn.current && canvas.width > 0 && canvas.height > 0) {
                    tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tCtx = tempCanvas.getContext('2d');
                    if (tCtx) tCtx.drawImage(canvas, 0, 0);
                }

                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;

                // Restore context state
                initContext(ctx, dpr);
                contextRef.current = ctx;

                // Restore content
                if (tempCanvas) {
                    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
                } else if (initialImage && !hasDrawn.current) {
                    // Load initial image if provided and no user drawing yet
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, displayWidth, displayHeight); // Draw scaled to fit
                        hasDrawn.current = true;
                    };
                    img.src = initialImage;
                }
            };

            // Initial setup
            handleResize();

            // Observer is better than window.resize for specific elements
            const resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            resizeObserver.observe(container);

            // Prevent default touch actions
            const preventDefault = (e: TouchEvent) => {
                if (e.target === canvas) e.preventDefault();
            };

            canvas.addEventListener('touchstart', preventDefault, { passive: false });
            canvas.addEventListener('touchmove', preventDefault, { passive: false });
            canvas.addEventListener('touchend', preventDefault, { passive: false });

            return () => {
                resizeObserver.disconnect();
                canvas.removeEventListener('touchstart', preventDefault);
                canvas.removeEventListener('touchmove', preventDefault);
                canvas.removeEventListener('touchend', preventDefault);
            };
        }, [width, height, initialImage]);

        useImperativeHandle(ref, () => ({
            clear: () => {
                const canvas = canvasRef.current;
                if (canvas && contextRef.current) {
                    contextRef.current.save();
                    contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
                    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
                    contextRef.current.restore();
                    hasDrawn.current = false;
                }
            },
            getDataUrl: () => {
                return canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';
            },
            isEmpty: () => !hasDrawn.current
        }));

        // Helper to get correct coordinates
        const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const { x, y } = getCoordinates(e);
            contextRef.current?.beginPath();
            contextRef.current?.moveTo(x, y);
            setIsDrawing(true);
            hasDrawn.current = true;
            if (onDraw) onDraw();
        };

        const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
            if (!isDrawing) return;
            const { x, y } = getCoordinates(e);
            contextRef.current?.lineTo(x, y);
            contextRef.current?.stroke();
            if (onDraw) onDraw();
        };

        const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            contextRef.current?.closePath();
            setIsDrawing(false);
        };

        return (
            <div
                ref={containerRef}
                className={cn("relative w-full rounded-lg bg-white touch-none shadow-sm overflow-hidden", className)}
                style={{ minHeight: height ? `${height}px` : '300px' }}
            >
                <canvas
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    className="w-full h-full cursor-crosshair block"
                />
                {!hideLabel && (
                    <div className="absolute bottom-2 left-2 text-xs text-indigo-400/50 pointer-events-none select-none font-medium">
                        Area di disegno
                    </div>
                )}
            </div>
        );
    }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
