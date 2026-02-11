import { Work } from '@/components/experience/work';
import { data } from '@/lib/data';
import { cn } from '@/utils/cn';
import { generateUniqueId } from '@/utils/generate-unique-id';

export function Experience() {
    const experiences = data.workExperiences.map((experience) => ({
        id: generateUniqueId(),
        content: experience,
    }));

    return (
        <section
            id="experience"
            className="max-w-180 w-full py-24 px-8 flex flex-col gap-16 bg-primary overflow-hidden"
            aria-label="Work experience"
        >
            <header className="flex flex-col gap-3 items-center justify-center text-center">
                <h1 className="text-display-md font-display font-semibold text-primary">
                    My working experience
                </h1>
                <p className="text-xl text-tertiary">
                    Contributing my knowledge since 2023
                </p>
            </header>
            <ol
                className="flex flex-col items-center"
                aria-label="Timeline of work experience"
            >
                {experiences.map((work, i, arr) => (
                    <li key={work.id} className="flex flex-col items-center">
                        <Work {...work.content} />
                        {!(i === arr.length - 1) && (
                            <hr
                                className={cn(
                                    'h-17 w-px border-0 bg-border-secondary select-none',
                                    i === 0 && 'w-0.5 bg-border-brand',
                                )}
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </section>
    );
}
