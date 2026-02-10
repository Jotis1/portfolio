import { ImageUserCheck, Mail01 } from '@untitledui/icons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { GitHub } from './assets/icons/github';
import { LinkedInIcon } from './assets/icons/linkedin';

type FooterLink = {
    id: number;
    content: ReactNode;
    href: string;
};

const footerLinks: FooterLink[] = [
    {
        id: 1,
        content: (
            <>
                <LinkedInIcon className="size-5" />
                LinkedIn
            </>
        ),
        href: 'https://www.linkedin.com/in/jotis-cuellar',
    },
    {
        id: 2,
        content: (
            <>
                <GitHub className="size-5" />
                GitHub
            </>
        ),
        href: 'https://github.com/jotis1',
    },
    {
        id: 3,
        content: (
            <>
                <Mail01 className="size-5" />
                Email
            </>
        ),
        href: 'mailto:business@jotis.me',
    },
    {
        id: 4,
        content: (
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
                <Link
                    key={link.id}
                    href={link.href}
                    className="flex items-center gap-2"
                >
                    {link.content}
                </Link>
            ))}
        </footer>
    );
}
