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
    skills: ReactNode[];
    workExperiences: WorkExperienceSchema[];
    projects: ProjectSchema[];
}
