import { Geist, Geist_Mono, Merriweather } from 'next/font/google';

export const body = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
});

export const display = Merriweather({
    variable: '--font-merriweather',
    subsets: ['latin'],
    display: 'swap',
});

export const mono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});
