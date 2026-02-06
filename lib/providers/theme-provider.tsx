'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { type PropsWithChildren, useEffect, useState } from 'react';

export function ThemeProvider({ children }: PropsWithChildren) {
    const [mounted, isMounted] = useState(false);

    useEffect(() => {
        isMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <NextThemeProvider
            disableTransitionOnChange
            attribute="class"
            value={{ light: 'light-mode', dark: 'dark-mode' }}
        >
            {children}
        </NextThemeProvider>
    );
}
