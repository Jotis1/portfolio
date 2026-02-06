import type { ComponentProps } from 'react';
import { HandDrawnUnderline } from '@/components/assets/hand-drawn-underline';
import { GitHubIcon } from '@/components/assets/icons/github-icon';
import { LinkedInIcon } from '@/components/assets/icons/linkedin-icon';
import { BadgeGroup } from '@/components/base/badge-group';
import { Button } from '@/components/base/button';
import { Tooltip } from '@/components/base/tooltip';

type HeroHeaderProps = {
    title: string;
    subtitle: string;
    tooltip: ComponentProps<typeof Tooltip>;
    badgeGroup: ComponentProps<typeof BadgeGroup>;
    socialLinks: {
        github: string;
        linkedin: string;
    };
};

export function HeroHeader({
    title,
    subtitle,
    tooltip,
    badgeGroup,
    socialLinks,
}: HeroHeaderProps) {
    return (
        <header className="flex flex-col items-center gap-8">
            <BadgeGroup {...badgeGroup} />
            <div className="flex flex-col items-center gap-3 text-center">
                <Tooltip {...tooltip} />
                <h1 className="text-display-xl font-bold font-display text-primary">
                    {title}
                </h1>
                <h2 className="text-display-xs font-display text-secondary">
                    {subtitle}
                </h2>
                <HandDrawnUnderline className="text-fg-primary" />
            </div>
            <div className="flex items-center gap-4">
                <Button
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GitHubIcon className="size-6 text-fg-primary" />
                </Button>
                <Button
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LinkedInIcon className="size-6 text-[#0A66C2]" />
                </Button>
            </div>
        </header>
    );
}
