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
        avatar: 'https://github.com/jotis1.png',
        name: 'Juan M. Cuellar',
        alias: 'Jotis',
        description: 'A 21-yo spanish software developer',
        about: (
            <>
                My name is{' '}
                <strong className="font-semibold text-brand-secondary">
                    Juan Manuel
                </strong>{' '}
                but I like to be called Jotis. I started programming when I was
                very young, making discord bots for "osu!" servers.
                <br />
                <br />I always liked creating things and I used{' '}
                <strong className="font-semibold text-brand-secondary">
                    code as a tool for it
                </strong>
                . I am not a{' '}
                <strong className="font-semibold text-brand-secondary">
                    conformist person
                </strong>
                , if something can be done better I will look for a way to make
                it possible.
                <br />
                <br />I like to help my colleagues and{' '}
                <strong className="font-semibold text-brand-secondary">
                    share my knowledge
                </strong>
                , I believe in teamwork and camaraderie.
            </>
        ),
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
