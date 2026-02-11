import type { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
    return (
        <div className='py-1 px-1.5 flex items-center gap-1.5 border bg-primary border-primary drop-shadow-xs rounded-md font-medium text-xs'>
            {children}
        </div>
    );
}
