import type { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
    return (
        <div className="w-fit px-2.5 py-0.5 flex items-center gap-2bg-primary border border-primary drop-shadow-xs rounded-xl text-xs text-secondary font-medium">
            {children}
        </div>
    );
}
