import Image from 'next/image';
import type { ReactNode } from 'react';
import { Badge } from '../base/badge';

interface ProjectProps {
    name: string;
    description: string;
    tags: {
        id: number;
        content: ReactNode;
    }[];
    image: string;
}

export function Project({ name, description, tags, image }: ProjectProps) {
    return (
        <div className="max-w-sm flex flex-col rounded-2xl bg-primary border-2 border-brand drop-shadow-md overflow-hidden">
            <picture className="relative w-full h-64 bg-tertiary">
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
                    {tags.map((t, _) => (
                        <Badge key={t.id}>{t.content}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
