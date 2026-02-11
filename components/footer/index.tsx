import { GitHubDark, LinkedIn } from '@ridemountainpig/svgl-react';
import { ImageUserCheck, Mail01 } from '@untitledui/icons';
import type { ComponentProps } from 'react';
import { FooterLink } from '@/components/footer/footer-link';
import { data } from '@/lib/data';

const footerLinks: ComponentProps<typeof FooterLink>[] = [
    {
        id: '1',
        children: (
            <>
                <LinkedIn className="size-5 *:fill-fg-white" />
                LinkedIn
            </>
        ),
        href: data.social.linkedin,
    },
    {
        id: '2',
        children: (
            <>
                <GitHubDark className="size-5" />
                GitHub
            </>
        ),
        href: data.social.github,
    },
    {
        id: '3',
        children: (
            <>
                <Mail01 className="size-5" />
                Email
            </>
        ),
        href: `mailto:${data.social.email}`,
    },
    {
        id: '4',
        children: (
            <>
                <ImageUserCheck className="size-5" />
                Curriculum
            </>
        ),
        href: '/cv',
    },
];

export function Footer() {
    return (
        <footer className="w-full py-12 flex flex-wrap items-center justify-center gap-8 bg-brand-section text-fg-white text-sm">
            {footerLinks.map((link, _) => (
                <FooterLink key={link.id} {...link} />
            ))}
        </footer>
    );
}
