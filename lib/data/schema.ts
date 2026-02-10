import type { ReactNode } from 'react';

type ProgrammingLanguage =
    | 'typescript'
    | 'javascript'
    | 'powershell'
    | 'python'
    | 'php'
    | 'go'
    | 'rust'
    | 'java';

type MarkupLanguage = 'html' | 'css' | 'svg';

type Library =
    | 'bun'
    | 'motion'
    | 'react'
    | 'vue'
    | 'preact'
    | 'solidjs'
    | 'zod'
    | 'lodash'
    | 'date-fns';

type Framework =
    | 'nextjs'
    | 'tailwindcss'
    | 'nuxt'
    | 'sveltekit'
    | 'angular'
    | 'remix'
    | 'astro'
    | 'qwik'
    | 'nestjs';

type Skill = ProgrammingLanguage | MarkupLanguage | Library | Framework;

interface WorkExperienceSchema {
    company: string;
    role: string;
    description: string;
    duration: {
        from: Date;
        to: Date | 'currently';
    };
}

interface ProjectSchema {
    name: string;
    description: string;
    image: string;
    skills: Skill[];
}

export interface DataSchema {
    badge?: {
        addonText: string;
        content: string;
        href?: string;
    };
    user: {
        name: string;
        alias: string;
        description: string;
        about: {
            avatar: string;
            content: ReactNode;
        };
    };
    social: {
        github: string;
        linkedin: string;
        email: string;
    };
    skills: Skill[];
    workExperiences: WorkExperienceSchema[];
    projects: ProjectSchema[];
}
