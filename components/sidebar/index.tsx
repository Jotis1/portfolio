'use client';

import type { ComponentProps } from 'react';
import { NavLink } from './nav-link';

const navLinks: ComponentProps<typeof NavLink>[] = [
    {
        id: '1',
        href: '#skills',
        children: 'Skills',
    },
    {
        id: '2',
        href: '#experience',
        children: 'Experience',
    },
    {
        id: '3',
        href: '#projects',
        children: 'Projects',
    },
    {
        id: '4',
        href: '#about',
        children: 'About',
    },
    {
        id: '5',
        href: '/blog',
        children: 'Blog',
    },
];

export function Sidebar() {
    return (
        <nav className='z-10 fixed top-8 left-8 w-fit p-4 hidden lg:flex flex-col items-center gap-6 rounded-xl bg-alpha-white/90 backdrop-blur-xs'>
            <h1 className='text-display-xs font-display font-bold italic text-brand-primary'>
                Jotis.me
            </h1>
            <hr className='w-full border-secondary' />
            <div className='flex flex-col gap-2'>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.id}
                        {...link}
                    />
                ))}
            </div>
        </nav>
    );
}
