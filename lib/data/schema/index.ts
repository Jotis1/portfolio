import type { ReactNode } from 'react';

import { z } from 'zod';

const badgeSchema = z.object({
    addonText: z.string(),
    content: z.string(),
    href: z.url().or(z.string().startsWith('/')),
});

const userSchema = z.object({
    avatar: z.string(),
    name: z.string(),
    alias: z.string().optional(),
    description: z.string(),
    about: z.custom<ReactNode>(),
});

const socialSchema = z.object({
    github: z.url(),
    linkedin: z.url(),
    email: z.email(),
});

const skillSchema = z.custom<ReactNode>();

const workExperienceSchema = z.object({
    company: z.string(),
    role: z.string(),
    description: z.string(),
    duration: z.object({
        from: z.date(),
        to: z.date().or(z.literal('currently')),
    }),
});

const projectSchema = z.object({
    name: z.string(),
    description: z.string(),
    image: z.url().or(z.string().startsWith('/')),
    skills: z.array(skillSchema),
});

const dataSchema = z.object({
    badge: badgeSchema,
    user: userSchema,
    social: socialSchema,
    skills: z.array(skillSchema),
    workExperience: z.array(workExperienceSchema),
    projects: z.array(projectSchema),
});

export type BadgeSchema = z.infer<typeof badgeSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type SocialSchema = z.infer<typeof socialSchema>;
export type SkillSchema = z.infer<typeof skillSchema>;
export type WorkExperienceSchema = z.infer<typeof workExperienceSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type DataSchema = z.infer<typeof dataSchema>;

export {
    badgeSchema,
    userSchema,
    socialSchema,
    skillSchema,
    workExperienceSchema,
    projectSchema,
    dataSchema,
};
