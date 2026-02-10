import type { data } from '@/lib/data';

export const workExperiences: typeof data.workExperiences = [
    {
        company: 'Becall',
        role: 'Software Developer & Cibersecurity Manager',
        description:
            'Developing multiplatform applications and managing the company\u2019s mobile timekeeping application. Implementing best practices and test-based development.',
        duration: {
            from: new Date('01/12/2024'),
            to: 'currently',
        },
    },
    {
        company: 'Becall',
        role: 'Junior Full-stack Developer',
        description:
            'Developing multiplatform applications and managing the company\u2019s mobile timekeeping application. Implementing best practices and test-based development.',
        duration: {
            from: new Date('01/09/2023'),
            to: new Date('01/12/2024'),
        },
    },
    {
        company: 'Furor Games',
        role: 'Full-stack Developer',
        description:
            'Client project for an online gymkhana store, using Strapi as a headless CMS with a GraphQL API, built with Next.js and secure payments processing via Redsys.',
        duration: {
            from: new Date('01/11/2023'),
            to: new Date('01/05/2024'),
        },
    },
];
