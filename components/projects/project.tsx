import { CloudOff } from '@untitledui/icons';
import Image from 'next/image';
import { Badge } from '@/components/base/badge';
import type { ProjectSchema } from '@/lib/data/schema';
import { generateUniqueId } from '@/utils/generate-unique-id';

export function Project({ name, description, skills, image }: ProjectSchema) {
    return (
        <div className='w-fit max-w-sm flex flex-col rounded-2xl bg-primary border-2 border-brand drop-shadow-md overflow-hidden'>
            <picture className='relative w-full aspect-video bg-brand-secondary'>
                {image ? (
                    <Image
                        src={image}
                        alt={`${name} mockup`}
                        fill
                        className='object-cover'
                    />
                ) : (
                    <div className='size-full flex items-center justify-center'>
                        <CloudOff className='fill-fg-brand-primary *:stroke-fg-brand-primary size-10' />
                    </div>
                )}
            </picture>
            <div className='p-6 flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg font-semibold text-primary'>
                        {name}
                    </h2>
                    <p className='text-balance'>{description}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {skills.map((skill, _) => (
                        <Badge key={generateUniqueId()}>{skill}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
