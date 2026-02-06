interface StatProps {
    id: string;
    count: number;
    description: string;
}

type HeroStatsProps = [StatProps, StatProps];

export function HeroStats({ stats }: { stats: HeroStatsProps }) {
    return (
        <div className="w-full flex flex-wrap items-center justify-center">
            {stats.map((stat, _) => (
                <div
                    key={`hero-stat-${stat.id}`}
                    className="max-w-xs w-full flex flex-col items-center gap-4 text-center"
                >
                    <div className="text-display-xl font-display font-bold text-brand-tertiary_alt">
                        {stat.count}
                    </div>
                    <div className="text-lg text-primary">
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
