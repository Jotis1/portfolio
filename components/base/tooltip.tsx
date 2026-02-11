type TooltipProps = {
    content: string;
};

export function Tooltip({ content }: TooltipProps) {
    return (
        <span className='relative px-3 py-2 bg-fg-primary text-bg-primary text-xs font-semibold drop-shadow-lg rounded-xl'>
            A.K.A. {content}
            <span className='absolute -bottom-1 right-4 size-3 rounded-xs bg-fg-primary rotate-45' />
        </span>
    );
}
