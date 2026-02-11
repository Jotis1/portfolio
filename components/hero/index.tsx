import { GridCheckPattern } from '@/components/assets/patterns/grid-check';
import { HeroHeader } from '@/components/hero/hero-header';
import { HeroStats } from '@/components/hero/hero-stats';
import { ThemeButton } from '@/components/theme-button';

export function Hero() {
    return (
        <section
            className='relative py-24 lg:px-8 px-4 flex flex-col gap-12 overflow-hidden'
            aria-labelledby='hero-heading'
        >
            <div className='absolute w-full flex justify-between top-0 left-0 lg:p-8 p-4'>
                <h1 className='lg:hidden text-display-xs font-display font-bold italic text-brand-primary'>
                    Jotis.me
                </h1>
                <ThemeButton />
            </div>
            <GridCheckPattern
                className='-z-10 absolute top-0 left-1/2 -translate-x-1/2'
                aria-hidden='true'
            />
            <HeroHeader />
            <HeroStats />
        </section>
    );
}
