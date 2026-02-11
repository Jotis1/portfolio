import Image from 'next/image';
import type { ProjectSchema } from '@/lib/data/schema';
import { generateUniqueId } from '@/utils/generate-unique-id';
import { Badge } from '../base/badge';

export function Project({ name, description, skills, image }: ProjectSchema) {
    return (
        <div className="max-w-sm flex flex-col rounded-2xl bg-primary border-2 border-brand drop-shadow-md overflow-hidden">
            <picture className="relative w-full h-64 bg-brand-primary">
                <Image
                    src={image}
                    alt={`${name} mockup`}
                    fill
                    className="object-cover"
                />
            </picture>
            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-primary">
                        {name}
                    </h2>
                    <p>{description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, _) => (
                        <Badge key={generateUniqueId()}>{skill}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
