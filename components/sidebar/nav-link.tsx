import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
    return (
        <Link
            className={cn(
                'h-6 px-4 py-0.5 text-sm font-semibold text-quaternary',
                className,
            )}
            {...props}
        />
    );
}
