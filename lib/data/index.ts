import type { DataSchema } from '@/lib/data/schema';

export const data: DataSchema = {
    badge: {
        addonText: 'Update',
        content: 'I\u2019ve created Yoruverse. Read about it!',
        href: '#',
    },
    user: {
        name: 'Juan M. Cuellar',
        alias: 'Jotis',
        description: 'A 21-yo spanish software developer',
        about: {
            avatar: 'https://github.com/jotis1.png',
            content: 'Hola',
        },
    },
    social: {
        github: 'https://github.com/jotis1',
        linkedin: 'https://www.linkedin.com/in/jotis-cuellar',
        email: 'business@jotis.me',
    },
    skills: [
        'typescript',
        'javascript',
        'powershell',
        'python',
        'php',
        'css',
        'html',
    ],
    workExperiences: [
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
            company: 'Becall',
            role: 'Software Developer & Cibersecurity Manager',
            description:
                'Developing multiplatform applications and managing the company\u2019s mobile timekeeping application. Implementing best practices and test-based development.',
            duration: {
                from: new Date('01/11/2023'),
                to: new Date('01/05/2024'),
            },
        },
    ],
    projects: [
        {
            name: 'Byte & Slice',
            description:
                'Experience the free, unlimited, open-source URL shortener that puts your privacy first—no tracking, no logs, no cookies. Deploy and self-host effortlessly on your server with Docker in just minutes!',
            image: '/byte-and-slice.png',
            skills: ['tailwindcss', 'nextjs', 'bun'],
        },
        {
            name: 'Becall App',
            description:
                'A mobile application designed to efficiently manage productivity for modern businesses. It enables employees to accurately track schedules, clock in and out and manage breaks.',
            image: '/becall-app.png',
            skills: ['tailwindcss', 'angular'],
        },
        {
            name: 'Yorubot',
            description:
                'Experience the free, unlimited, open-source URL shortener that puts your privacy first—no tracking, no logs, no cookies. Deploy and self-host effortlessly on your server with Docker in just minutes!',
            image: '/byte-and-slice.png',
            skills: ['typescript', 'bun'],
        },
    ],
};
