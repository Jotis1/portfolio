import {
    Android,
    Angular,
    Bun,
    Nextjs,
    TailwindCSS,
    TypeScript,
} from '@ridemountainpig/svgl-react';
import { Fragment } from 'react/jsx-runtime';
import type { data } from '@/lib/data';

export const projects: typeof data.projects = [
    {
        name: 'Byte & Slice',
        description:
            'Experience the free, unlimited, open-source URL shortener that puts your privacy first—no tracking, no logs, no cookies. Deploy and self-host effortlessly on your server with Docker in just minutes!',
        image: '/project-mockups/byte-and-slice.png',
        skills: [
            <Fragment key={1}>
                <TailwindCSS className="size-4" />
                Tailwindcss
            </Fragment>,
            <Fragment key={2}>
                <Nextjs className="size-4" />
                Next.js
            </Fragment>,
            <Fragment key={3}>
                <Bun className="size-4" />
                Bun
            </Fragment>,
        ],
    },
    {
        name: 'Becall App',
        description:
            'A mobile application designed to efficiently manage productivity for modern businesses. It enables employees to accurately track schedules, clock in and out and manage breaks.',
        image: '/project-mockups/becall-app.png',
        skills: [
            <Fragment key={1}>
                <TailwindCSS className="size-4" />
                Tailwindcss
            </Fragment>,
            <Fragment key={2}>
                <Angular className="size-4" />
                Angular
            </Fragment>,
            <Fragment key={3}>
                <Android className="size-4" />
                Android
            </Fragment>,
        ],
    },
    {
        name: 'Yorubot',
        description:
            'Experience the free, unlimited, open-source URL shortener that puts your privacy first—no tracking, no logs, no cookies. Deploy and self-host effortlessly on your server with Docker in just minutes!',
        image: '/project-mockups/byte-and-slice.png',
        skills: [
            <Fragment key={1}>
                <TypeScript className="size-4" />
                TypeScript
            </Fragment>,
            <Fragment key={2}>
                <Bun className="size-4" />
                Bun
            </Fragment>,
        ],
    },
];
