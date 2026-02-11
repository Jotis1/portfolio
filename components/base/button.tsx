'use client';

import Link from 'next/link';
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ComponentProps,
} from 'react';
import { cn } from '@/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
};

export function Button({
    size = 'md',
    href,
    className,
    children,
    ...props
}: (ButtonProps | ComponentProps<typeof Link>) & { size?: 'sm' | 'md' }) {
    const classNames = cn(
        'bg-primary hover:bg-primary_hover hover:text-secondary border border-primary drop-shadow-md',
        size === 'sm' ? 'p-1.5 text-sm rounded-md' : 'p-2.5 rounded-xl',
    );

    if (href) {
        return (
            <Link
                href={href}
                className={classNames}
                {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={classNames}
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
}
