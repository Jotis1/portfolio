import { Clock } from '@untitledui/icons';
import { HandDrawnAccent } from '@/components/assets/hand-drawn-accent';
import type { WorkExperienceSchema } from '@/lib/data/schema';
import { cn } from '@/utils/cn';

export function Work({
    company,
    role,
    description,
    duration,
}: WorkExperienceSchema) {
    const isCurrent = duration.to === 'currently';
    const fromYear = duration.from.getFullYear().toString();
    const toYear = isCurrent
        ? 'present'
        : (duration.to as Date).getFullYear().toString();

    return (
        <article
            className={cn(
                'relative max-w-lg w-full flex flex-col p-6 bg-primary border border-secondary rounded-2xl',
                isCurrent && 'border-2 border-brand',
            )}
            aria-label={`${role} at ${company} from ${fromYear} to ${toYear}`}
        >
            {isCurrent && (
                <>
                    <HandDrawnAccent
                        className='absolute -bottom-10 -right-10 text-fg-primary'
                        aria-hidden='true'
                    />
                    <HandDrawnAccent
                        className='absolute -top-10 -left-10 rotate-180 text-fg-primary'
                        aria-hidden='true'
                    />
                </>
            )}
            <header>
                <h3 className='text-sm font-semibold text-brand-secondary'>
                    {company}
                </h3>
                <h2 className='text-md font-semibold text-primary'>{role}</h2>
                <p className='mt-2 mb-5 text-tertiary'>{description}</p>
            </header>
            <span className='flex items-center gap-1.5 text-sm font-semibold text-tertiary'>
                <Clock
                    className='size-5 text-fg-quaternary'
                    aria-hidden='true'
                />
                <time dateTime={duration.from.toISOString()}>{fromYear}</time>
                <span aria-hidden='true'>-</span>
                {isCurrent ? (
                    <time dateTime={new Date().toISOString()}>present</time>
                ) : (
                    <time dateTime={(duration.to as Date).toISOString()}>
                        {toYear}
                    </time>
                )}
            </span>
        </article>
    );
}
