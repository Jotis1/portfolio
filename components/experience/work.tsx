import { Clock } from '@untitledui/icons';
import { HandDrawnAccent } from '@/components/assets/hand-drawn-accent';
import { cn } from '@/utils/cn';

interface WorkProps {
    enterprise: string;
    role: string;
    description: string;
    duration: string;
    present?: boolean;
}

export function Work({
    enterprise,
    role,
    description,
    duration,
    present,
}: WorkProps) {
    return (
        <div
            className={cn(
                'relative max-w-lg w-full  flex flex-col p-6 bg-primary border border-secondary rounded-2xl',
                present && 'border-2 border-brand',
            )}
        >
            {present && (
                <>
                    <HandDrawnAccent className="absolute -bottom-10 -right-10 text-fg-primary" />
                    <HandDrawnAccent className="absolute -top-10 -left-10 rotate-180 text-fg-primary" />
                </>
            )}
            <header>
                <h3 className="text-sm font-semibold text-brand-secondary">
                    {enterprise}
                </h3>
                <h2 className="text-md font-semibold text-primary">{role}</h2>
                <p className="mt-2 mb-5 text-tertiary">{description}</p>
            </header>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-tertiary">
                <Clock className="size-5 text-fg-quaternary" />
                {duration}
            </span>
        </div>
    );
}
