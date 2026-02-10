import { GitHubDark } from '@ridemountainpig/svgl-react';
import Link from 'next/link';
import { HandDrawnArrow } from '@/components/assets/hand-drawn-arrow';
import { LinePattern } from '@/components/assets/patterns/line';
import { Project } from '@/components/projects/project';
import { data } from '@/lib/data';
import { generateUniqueId } from '@/utils/generate-unique-id';

export function Projects() {
    const projects = data.projects.map((project) => ({
        id: generateUniqueId(),
        content: project,
    }));

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
                {projects.map((project, _) => (
                    <Project
                        key={project.id}
                        name={project.content.name}
                        description={project.content.description}
                        image={project.content.image}
                        skills={project.content.skills}
                    />
                ))}
            </div>
            <Link
                className="relative z-1 flex items-center gap-1 text-sm font-semibold text-brand-secondary"
                href={data.social.github}
            >
                See my GitHub
                <GitHubDark className="size-5 *:fill-fg-brand-secondary_alt" />
                <HandDrawnArrow className="absolute -left-[calc(100%+10px)] top-1/2 -translate-y-5 text-fg-primary" />
            </Link>
            <LinePattern className="absolute top-1/2 left-1/2 -translate-1/2" />
        </section>
    );
}
