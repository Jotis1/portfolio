import { GridCheckPattern } from '@/components/assets/patterns/grid-check';
import { HeroHeader } from '@/components/hero/hero-header';
import { HeroStats } from '@/components/hero/hero-stats';
import { ThemeButton } from '@/components/theme-button';

export function Hero() {
    return (
        <section
            className="relative max-w-180 w-full py-24 px-8 flex flex-col gap-12"
            aria-labelledby="hero-heading"
        >
            <div className="absolute top-8 right-8">
                <ThemeButton />
            </div>
            <GridCheckPattern
                className="-z-10 absolute top-0 left-1/2 -translate-x-1/2"
                aria-hidden="true"
            />
            <HeroHeader />
            <HeroStats />
        </section>
    );
}
