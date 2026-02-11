'use client';

import { type ReactNode, useMemo } from 'react';
import { data } from '@/lib/data';
import { generateUniqueId } from '@/utils/generate-unique-id';
import { Marquee } from './base/marquee';

interface MarqueeGroup {
    id: string;
    items: {
        id: string;
        content: ReactNode;
    }[];
}

export function Skills() {
    const skills = data.skills ?? [];

    const groups = useMemo((): MarqueeGroup[] => {
        const groupSize = 10;
        if (!skills?.length) return [];

        return Array.from(
            { length: Math.ceil(skills.length / groupSize) },
            (_, i) => {
                const start = i * groupSize;
                const groupItems = skills.slice(start, start + groupSize);
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
    }, [skills]);

    if (!groups.length) return null;
    return (
        <section
            id='skills'
            className='w-full lg:px-8 px-4 py-12 flex flex-col gap-6 bg-brand-section'
        >
            {groups.map((group, i) => (
                <Marquee
                    key={group.id}
                    pauseOnHover
                    reverse={i % 2 === 0}
                    className='max-w-5xl w-full mx-auto overflow-hidden mask-x-from-80%'
                >
                    <div
                        className='w-fit flex items-center gap-8 motion-reduce:animate-none'
                        aria-live='polite'
                    >
                        {group.items.map((item) => (
                            <span
                                key={item.id}
                                className='flex items-center gap-3 text-display-xs font-display font-bold text-fg-white whitespace-nowrap'
                                aria-hidden='true'
                            >
                                {item.content}
                            </span>
                        ))}
                    </div>
                </Marquee>
            ))}
        </section>
    );
}
