// Types
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

// Styles
import { body, display, mono } from '@/styles/fonts';
import '@/styles/globals.css';

// Lib
import { ActiveSectionProvider } from '@/lib/providers/active-section-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';

// Utils
import { cn } from '@/utils/cn';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    colorScheme: 'light',
    themeColor: '#444CE7',
};

export const metadata: Metadata = {
    title: "Jotis's Portfolio",
    description:
        "Hi there, I'm Jotis, a spanish software developer and corporate security team lead. Check out my portfolio to explore some of my projects.",
    authors: [
        {
            name: 'Jotis',
            url: 'https://jotis.me',
        },
    ],
    creator: 'Jotis',
    openGraph: {
        title: "Jotis's Portfolio",
        description:
            "Hi there, I'm Jotis, a spanish software developer and corporate security team lead. Check out my portfolio to explore some of my projects.",
        siteName: "Jotis's Portfolio",
        locale: 'en_US',
        type: 'website',
    },
};

export default function RootLayout({ children }: PropsWithChildren) {
    const fonts = [body.variable, display.variable, mono.variable];

    return (
        <html
            lang='en'
            className={cn(fonts, 'scroll-smooth scrollbar-hide')}
        >
            <body className='bg-primary text-tertiary antialiased selection:bg-brand-solid selection:text-primary_on-brand'>
                <ThemeProvider>
                    <ActiveSectionProvider>{children}</ActiveSectionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
