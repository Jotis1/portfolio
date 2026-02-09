import type { ComponentProps } from 'react';
import { Work } from '@/components/experience/work';
import { cn } from '@/utils/cn';

const works: (ComponentProps<typeof Work> & { id: number })[] = [
    {
        id: 1,
        enterprise: 'Becall',
        role: 'Software Developer & Cibersecurity Manager',
        description:
            'Developing multiplatform applications and managing the company\u2019s mobile timekeeping application. Implementing best practices and test-based development.',
        duration: '2024-present',
        present: true,
    },
    {
        id: 2,
        enterprise: 'Becall',
        role: 'Junior Full-stack Developer',
        description:
            'Developing multiplatform applications and managing the company\u2019s mobile timekeeping application. Implementing best practices and test-based development.',
        duration: '2023-2024',
    },
    {
        id: 3,
        enterprise: 'Furor Games',
        role: 'Full-stack Developer',
        description:
            'Client project for an online gymkhana store, using Strapi as a headless CMS with a GraphQL API, built with Next.js and secure payments processing via Redsys.',
        duration: '2023-2024',
    },
];

export function Experience() {
    return (
        <section className="max-w-180 w-full py-24 px-8 flex flex-col gap-16 bg-primary">
            <header className="flex flex-col gap-3 items-center justify-center text-center">
                <h1 className="text-display-md font-display font-semibold text-primary">
                    My working experience
                </h1>
                <p className="text-xl text-tertiary">
                    Contributing my knowledge since 2023
                </p>
            </header>
            <div className="flex flex-col items-center">
                {works.map((w, _, arr) => (
                    <div key={w.id} className="flex flex-col items-center">
                        <Work
                            enterprise={w.enterprise}
                            role={w.role}
                            description={w.description}
                            duration={w.duration}
                            present={w.present}
                        />
                        {w.id !== arr.length && (
                            <hr
                                className={cn(
                                    `h-17 w-px border-0 bg-border-secondary`,
                                    w.id === 1 && 'w-0.5 bg-border-brand',
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
