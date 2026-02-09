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
            <div className="p-5 max-w-5xl w-full mx-auto overflow-hidden mask-x-from-80%">
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
            </div>
        </section>
    );
}
