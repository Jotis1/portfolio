import { badge } from '@/lib/data/badge';
import { projects } from '@/lib/data/projects';
import { dataSchema } from '@/lib/data/schema';
import { skills } from '@/lib/data/skills';
import { social } from '@/lib/data/social';
import { user } from '@/lib/data/user';
import { workExperiences } from '@/lib/data/work-experiences';

const data = dataSchema.parse({
    badge,
    user,
    social,
    skills,
    workExperiences,
    projects,
});

export { data };
