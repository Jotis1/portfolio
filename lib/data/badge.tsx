import { badgeSchema } from '@/lib/data/schema';

const badge = badgeSchema.parse({
    addonText: 'Update',
    content: 'I\u2019ve created Yoruverse. Read about it!',
    href: '/#',
});

export { badge };
