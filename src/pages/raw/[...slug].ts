import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const getStaticPaths = async () => {
    const wiki = await getCollection('wiki');
    const pages = wiki.map((page) => ({
        params: { slug: `${page.id}.md` },
        props: { page },
    }));

    return pages;
};

export const GET: APIRoute = ({ props }) => {
    const { page } = props;

    return new Response(page.body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
