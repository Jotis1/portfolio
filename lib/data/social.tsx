import { socialSchema } from '@/lib/data/schema';

const social = socialSchema.parse({
    github: 'https://github.com/jotis1',
    linkedin: 'https://www.linkedin.com/in/jotis-cuellar',
    email: 'business@jotis.me',
});

export { social };
