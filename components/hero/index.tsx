import type { ComponentProps } from 'react';
import { HeroHeader } from '@/components/hero/hero-header';
import { GridCheckPattern } from '../assets/patterns/grid-check';
import { ThemeButton } from '../theme-button';
import { HeroStats } from './hero-stats';

const headerProps: ComponentProps<typeof HeroHeader> = {
    title: 'I\u2019m Juan M. Cuellar',
    subtitle: 'a 21-yo spanish software developer',
    tooltip: { text: 'A.K.A. Jotis' },
    badgeGroup: {
        addonText: 'Update',
        text: 'I\u2019ve created Yoruverse. Read about it!',
        href: 'https://yoruverse.com',
    },
    socialLinks: {
        github: 'https://github.com/jotis1',
        linkedin: 'https://linkedin.com/in/jotis-cuellar',
    },
};

const firstDayOfWork = new Date('2023-09-1');
const today = new Date();
const yearsOfExperience = Math.floor(
    (today.getTime() - firstDayOfWork.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000),
);

const statsProps: ComponentProps<typeof HeroStats> = {
    stats: [
        { id: 'projects', count: 12, description: 'Projects completed' },
        {
            id: 'experience',
            count: yearsOfExperience,
            description: 'Years of experience',
        },
    ],
};

export function Hero() {
    return (
        <section className="relative max-w-180 w-full py-24 px-8 flex flex-col gap-12">
            <div className="absolute top-8 right-8">
                <ThemeButton />
            </div>
            <GridCheckPattern className="-z-10 absolute top-0 left-1/2 -translate-x-1/2" />
            <HeroHeader {...headerProps} />
            <HeroStats {...statsProps} />
        </section>
    );
}
