import type { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
    return (
        <div className="w-fit px-1.5 py-1 flex items-center gap-2 bg-primary border border-primary drop-shadow-xs rounded-xl text-xs text-secondary font-medium">
            {children}
        </div>
    );
}
