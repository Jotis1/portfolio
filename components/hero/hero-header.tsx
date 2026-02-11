import { GitHubLight as GitHub, LinkedIn } from '@ridemountainpig/svgl-react';
import { HandDrawnUnderline } from '@/components/assets/hand-drawn-underline';
import { BadgeGroup } from '@/components/base/badge-group';
import { Button } from '@/components/base/button';
import { Tooltip } from '@/components/base/tooltip';
import { data } from '@/lib/data';

export function HeroHeader() {
    return (
        <header
            className='flex flex-col items-center gap-8'
            id='hero-heading'
        >
            {data.badge && <BadgeGroup {...data.badge} />}
            <div className='flex flex-col items-center gap-3 text-center'>
                <Tooltip content={data.user?.alias ?? ''} />
                <h1 className='text-display-xl font-bold font-display text-primary'>
                    I&apos;m {data.user?.name ?? 'Developer'}
                </h1>
                <h2 className='text-display-xs font-display text-secondary lowercase'>
                    {data.user?.description ?? ''}
                </h2>
                <HandDrawnUnderline
                    className='text-fg-primary'
                    aria-hidden='true'
                />
            </div>
            <div className='flex items-center gap-4'>
                {data.social?.github && (
                    <Button
                        href={data.social.github}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='GitHub profile'
                        className='focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary'
                    >
                        <GitHub className='size-6 *:fill-fg-primary' />
                    </Button>
                )}
                {data.social?.linkedin && (
                    <Button
                        href={data.social.linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='LinkedIn profile'
                        className='focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A66C2]'
                    >
                        <LinkedIn className='size-6' />
                    </Button>
                )}
            </div>
        </header>
    );
}
