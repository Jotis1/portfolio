import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const wiki = defineCollection({
    loader: glob({ base: './src/content/wiki', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()),
    }),
});

export const collections = { wiki };
