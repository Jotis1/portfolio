import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            text: [
                'display-xs',
                'display-sm',
                'display-md',
                'display-lg',
                'display-xl',
                'display-2xl',
            ],
        },
    },
});

export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes));
