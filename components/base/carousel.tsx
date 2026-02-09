import type { ReactNode } from 'react';

interface CarouselProps {
    elements: {
        id: number;
        content: ReactNode;
    }[];
}

export function Carousel({ elements }: CarouselProps) {
    const items = [
        ...elements,
        ...elements.map((e) => ({ ...e, id: e.id + elements.length })),
    ];

    return (
        <section className="w-full px-8 py-24 bg-brand-section">
            <div className="p-5 relative max-w-5xl w-full mx-auto overflow-hidden">
                <div className="w-fit flex items-center gap-8 animate-marquee">
                    {items.map((e, _) => (
                        <span
                            key={e.id}
                            className="flex items-center gap-3 text-display-xs font-display font-bold text-white"
                        >
                            {e.content}
                        </span>
                    ))}
                </div>
                <span className="size-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-brand-section via-transparent to-brand-section" />
            </div>
        </section>
    );
}
