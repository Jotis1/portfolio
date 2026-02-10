import { projects } from '@/lib/data/projects';
import type { DataSchema } from '@/lib/data/schema';
import { skills } from '@/lib/data/skills';
import { workExperiences } from '@/lib/data/work-experiences';

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
    skills,
    workExperiences,
    projects,
};
