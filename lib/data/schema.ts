import type { ReactNode } from 'react';

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
    skills: ReactNode[];
}

export interface DataSchema {
    badge?: {
        addonText: string;
        content: string;
        href?: string;
    };
    user: {
        avatar: string;
        name: string;
        alias: string;
        description: string;
        about: ReactNode;
    };
    social: {
        github: string;
        linkedin: string;
        email: string;
    };
    skills: ReactNode[];
    workExperiences: WorkExperienceSchema[];
    projects: ProjectSchema[];
}
