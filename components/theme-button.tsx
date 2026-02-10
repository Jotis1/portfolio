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
            className="*:size-5 text-fg-quaternary"
        >
            {theme === 'dark' ? <Sun /> : <Moon01 />}
        </Button>
    );
}
