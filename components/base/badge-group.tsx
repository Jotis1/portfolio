import { ArrowRight } from '@untitledui/icons';
import type { BadgeSchema } from '@/lib/data/schema';

export function BadgeGroup({ addonText, content, href }: BadgeSchema) {
    return (
        <a
            href={href}
            className='w-fit p-1 pr-2 flex items-center gap-2 text-xs bg-primary hover:bg-primary_hover hover:text-primary border border-primary drop-shadow-xs rounded-xl text-secondary font-medium'
        >
            <div className='py-1 px-1.5 flex items-center gap-1.5 border bg-primary border-primary drop-shadow-xs rounded-md'>
                <span className='size-1.5 outline-[3px] outline-utility-brand-100 bg-utility-brand-500 rounded-full' />
                {addonText}
            </div>
            <div className='flex items-center gap-1'>
                {content}
                <ArrowRight
                    size={16}
                    className='text-utility-gray-500'
                />
            </div>
        </a>
    );
}
