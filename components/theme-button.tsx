'use client';

import { Moon01, Sun } from '@untitledui/icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/base/button';

export function ThemeButton() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            size='sm'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='text-fg-quaternary'
        >
            {theme === 'dark' ? (
                <Sun className='size-5' />
            ) : (
                <Moon01 className='size-5' />
            )}
        </Button>
    );
}
