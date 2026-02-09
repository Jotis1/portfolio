import Link from 'next/link';
import type { ComponentProps } from 'react';
import { HandDrawnArrow } from '@/components/assets/hand-drawn-arrow';
import { GitHubIcon } from '@/components/assets/icons/github-icon';
import { LinePattern } from '@/components/assets/patterns/line';
import { Project } from '@/components/projects/project';

const projects: (ComponentProps<typeof Project> & { id: number })[] = [
    {
        id: 1,
        name: 'Byte & Slice',
        description:
            'Experience the free, unlimited, open-source URL shortener that puts your privacy first—no tracking, no logs, no cookies. Deploy and self-host effortlessly on your server with Docker in just minutes!',
        image: '/project-mockups/byte-and-slice.png',
        tags: [
            {
                id: 1,
                content: 'TailwindCSS',
            },
            {
                id: 2,
                content: 'Next.js',
            },
            {
                id: 3,
                content: 'Bun',
            },
        ],
    },
    {
        id: 2,
        name: 'Becall App',
        description:
            'A mobile application designed to efficiently manage productivity for modern businesses. It enables employees to accurately track schedules, clock in and out and manage breaks.',
        image: '/project-mockups/becall-app.png',
        tags: [
            {
                id: 1,
                content: 'TailwindCSS',
            },
            {
                id: 2,
                content: 'Angular',
            },
            {
                id: 3,
                content: 'Ionic',
            },
        ],
    },
    {
        id: 3,
        name: 'Yorubot',
        description:
            'Built with the powerful Discord.js library. Crafted purely for entertainment and fun interactions. Ready to deploy, fully open-source, and released under the permissive MIT license!',
        image: '/project-mockups/yorubot.png',
        tags: [
            {
                id: 1,
                content: 'TypeScript',
            },
            {
                id: 2,
                content: 'Bun',
            },
        ],
    },
];

export function Projects() {
    return (
        <section className="relative w-full py-24 flex flex-col gap-16 items-center justify-center bg-brand-primary_alt">
            <header className="z-1 flex flex-col gap-3 items-center justify-center text-center">
                <h1 className="text-display-md font-display font-semibold text-brand-primary">
                    My projects
                </h1>
                <p className="text-xl text-brand-tertiary">
                    Take a look at my work
                </p>
            </header>
            <div className="z-1 flex flex-wrap items-center justify-center gap-8">
                {projects.map((p, _) => (
                    <Project
                        key={p.id}
                        name={p.name}
                        description={p.description}
                        image={p.image}
                        tags={p.tags}
                    />
                ))}
            </div>
            <Link
                className="relative z-1 flex items-center gap-1 text-sm font-semibold text-brand-secondary"
                href={'https://github.com/Jotis1'}
            >
                See my GitHub
                <GitHubIcon className="size-5 text-fg-brand-secondary_alt" />
                <HandDrawnArrow className="absolute -left-[calc(100%+10px)] top-1/2 -translate-y-5 text-fg-primary" />
            </Link>
            <LinePattern className="absolute top-1/2 left-1/2 -translate-1/2" />
        </section>
    );
}
