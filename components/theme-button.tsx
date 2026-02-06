'use client';

import { Moon01, Sun } from '@untitledui/icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/base/button';

export function ThemeButton() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <Sun className="size-5 text-fg-quaternary" />
            ) : (
                <Moon01 className="size-5 text-fg-quaternary" />
            )}
        </Button>
    );
}
