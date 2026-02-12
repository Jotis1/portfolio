import { GitHubDark } from '@ridemountainpig/svgl-react';
import Link from 'next/link';
import { HandDrawnArrow } from '@/components/assets/hand-drawn-arrow';
import { LinePattern } from '@/components/assets/patterns/line';
import { Project } from '@/components/projects/project';
import { data } from '@/lib/data';
import { generateUniqueId } from '@/utils/generate-unique-id';
import { BlurFade } from '../base/animation/blur-fade';

export function Projects() {
    const projects = data.projects.map((project) => ({
        id: generateUniqueId(),
        content: project,
    }));

    return (
        <section
            id='projects'
            className='relative w-full py-24 lg:px-8 px-4 flex flex-col gap-16 items-center justify-center bg-brand-primary_alt overflow-x-clip'
        >
            <header className='z-1 flex flex-col gap-3 items-center justify-center text-center'>
                <h1 className='text-display-md font-display font-semibold text-brand-primary'>
                    My projects
                </h1>
                <p className='text-xl text-brand-tertiary'>
                    Take a look at my work
                </p>
            </header>
            <div className='z-1 max-w-4xl w-full flex flex-wrap items-center justify-center gap-8 *:shrink-0'>
                {projects.map((project, i) => (
                    <BlurFade
                        key={project.id}
                        delay={0.2 * i}
                        inView
                        className='max-w-full'
                    >
                        <Project
                            name={project.content.name}
                            description={project.content.description}
                            image={project.content.image}
                            skills={project.content.skills}
                        />
                    </BlurFade>
                ))}
            </div>
            <div className='relative z-1 '>
                <Link
                    className='flex items-center gap-1 text-sm font-semibold text-brand-secondary hover:underline'
                    href={data.social.github}
                >
                    View my GitHub
                    <GitHubDark className='size-5 *:fill-fg-brand-secondary_alt' />
                </Link>
                <HandDrawnArrow className=' sm:size-auto size-32 absolute sm:-left-[calc(100%+10px)] -left-[calc(100%-10px)] top-1/2 sm:-translate-y-5 -translate-y-3.5 trab text-fg-primary' />
            </div>
            <LinePattern className='absolute top-1/2 left-1/2 -translate-1/2' />
        </section>
    );
}
