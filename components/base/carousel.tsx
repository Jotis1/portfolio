'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { generateUniqueId } from '@/utils/generate-unique-id';

interface CarouselItem {
    id: string;
    content: ReactNode;
}

interface CarouselGroup {
    id: string;
    items: CarouselItem[];
}

interface CarouselProps {
    items: ReactNode[];
}

export function Carousel({ items }: CarouselProps) {
    const groups = useMemo((): CarouselGroup[] => {
        const groupSize = 10;
        if (!items?.length) return [];

        return Array.from(
            { length: Math.ceil(items.length / groupSize) },
            (_, i) => {
                const start = i * groupSize;
                const groupItems = items.slice(start, start + groupSize);
                const duplicated = [...groupItems, ...groupItems];

                return {
                    id: generateUniqueId(),
                    items: duplicated.map((content) => ({
                        id: generateUniqueId(),
                        content,
                    })),
                };
            },
        );
    }, [items]);

    if (!groups.length) return null;

    return (
        <section
            className="w-full px-8 py-12 flex flex-col gap-6 bg-brand-section"
            aria-label="Carousel"
        >
            {groups.map((group) => (
                <div
                    key={group.id}
                    className="p-5 max-w-5xl w-full mx-auto overflow-hidden mask-x-from-80% odd:*:animate-marquee even:*:animate-marquee-reverse"
                >
                    <div
                        className="w-fit flex items-center gap-8 motion-reduce:animate-none"
                        aria-live="polite"
                    >
                        {group.items.map((item) => (
                            <span
                                key={item.id}
                                className="flex items-center gap-3 text-display-xs font-display font-bold text-fg-white whitespace-nowrap"
                                aria-hidden="true"
                            >
                                {item.content}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
