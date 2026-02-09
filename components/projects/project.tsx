interface ProjectProps {
    name: string;
    description: string;
    tags: string[];
    image: string;
}

export function Project({ name, description, tags, image }: ProjectProps) {
    return (
        <div className="max-w-sm flex flex-col rounded-2xl bg-primary border-2 border-brand drop-shadow-md overflow-hidden">
            <picture className="w-full h-64 bg-tertiary"></picture>
            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-primary">
                        {name}
                    </h2>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}
