import { ArrowRight } from '@untitledui/icons';

type BadgeGroupProps = {
    addonText: string;
    text: string;
    href?: string;
};

export function BadgeGroup({ addonText, text, href }: BadgeGroupProps) {
    return (
        <a
            href={href}
            className="w-fit p-1 pr-2 flex items-center gap-2 text-xs bg-primary border border-primary drop-shadow-xs rounded-xl text-secondary font-medium"
        >
            <div className="py-1 px-1.5 flex items-center gap-1.5 border bg-primary border-primary drop-shadow-xs rounded-md ">
                <span className="size-1.5 outline-[3px] outline-utility-brand-100 bg-utility-brand-500 rounded-full" />
                {addonText}
            </div>
            <div className="flex items-center gap-1">
                {text}
                <ArrowRight size={16} className="text-utility-gray-500" />
            </div>
        </a>
    );
}
