import { data } from '@/lib/data';

interface StatProps {
    count: number;
    description: string;
}

function Stat({ count, description }: StatProps) {
    return (
        <div
            className="max-w-xs w-full flex flex-col items-center gap-4 text-center"
            role="img"
            aria-label={`${description}: ${count}`}
        >
            <div className="text-display-xl font-display font-bold text-brand-tertiary_alt">
                {count.toLocaleString()}
            </div>
            <div className="text-lg text-primary">{description}</div>
        </div>
    );
}

interface HeroStatsData {
    projectsCount: number;
    yearsOfExperience: number;
}

function useHeroStats(): HeroStatsData {
    const firstDay =
        data.workExperiences?.[data.workExperiences.length - 1]?.duration.from;

    if (!firstDay || !(firstDay instanceof Date)) {
        return {
            projectsCount: data.projects?.length ?? 0,
            yearsOfExperience: 0,
        };
    }

    const today = new Date();
    let years = today.getFullYear() - firstDay.getFullYear();
    const monthDiff = today.getMonth() - firstDay.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < firstDay.getDate())
    ) {
        years--;
    }

    return {
        projectsCount: data.projects?.length ?? 0,
        yearsOfExperience: Math.max(0, years),
    };
}

export function HeroStats() {
    const { projectsCount, yearsOfExperience } = useHeroStats();

    return (
        <div className="w-full flex flex-wrap items-center justify-center gap-y-8">
            <Stat count={projectsCount} description="Projects completed" />
            <Stat count={yearsOfExperience} description="Years of experience" />
        </div>
    );
}
