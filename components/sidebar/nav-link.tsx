'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useActiveSection } from '@/lib/providers/active-section-provider';
import { cn } from '@/utils/cn';

interface NavLinkProps extends ComponentProps<typeof Link> {
    href: string;
}

export function NavLink({ className, href, children, ...props }: NavLinkProps) {
    const { activeSection } = useActiveSection();

    return (
        <Link
            href={href}
            className={cn(
                'h-6 px-4 py-0.5 text-sm font-semibold text-quaternary border-l-2 border-transparent',
                activeSection === href.replace('#', '') &&
                    'border-fg-brand-primary text-brand-secondary',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
