import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function FooterLink({
    className,
    ...props
}: ComponentProps<typeof Link>) {
    return (
        <Link className={cn('flex items-center gap-2', className)} {...props} />
    );
}
