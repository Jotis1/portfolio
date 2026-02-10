import type { ComponentProps } from 'react';
import { CSS } from '@/components/assets/icons/css';
import { JavaScript } from '@/components/assets/icons/javascript';
import { Php } from '@/components/assets/icons/php';
import { PowerShell } from '@/components/assets/icons/powershell';
import { Python } from '@/components/assets/icons/python';
import { TypeScript } from '@/components/assets/icons/typescript';
import { Carousel } from '@/components/base/carousel';
import { HTML5 } from './assets/icons/html';

const carouselProps: ComponentProps<typeof Carousel> = {
    elements: [
        {
            id: 1,
            content: (
                <>
                    <TypeScript className="size-8" />
                    TypeScript
                </>
            ),
        },
        {
            id: 2,
            content: (
                <>
                    <JavaScript className="size-8" />
                    JavaScript
                </>
            ),
        },
        {
            id: 3,
            content: (
                <>
                    <PowerShell className="size-8" />
                    PowerShell
                </>
            ),
        },
        {
            id: 4,
            content: (
                <>
                    {' '}
                    <Python className="size-8" />
                    Python
                </>
            ),
        },
        {
            id: 5,
            content: (
                <>
                    <Php className="size-9" />
                    Php
                </>
            ),
        },

        {
            id: 6,
            content: (
                <>
                    <CSS className="size-8" />
                    CSS
                </>
            ),
        },
        {
            id: 7,
            content: (
                <>
                    <HTML5 className="size-8" />
                    HTML5
                </>
            ),
        },
    ],
};

export function SkillsCarousel() {
    return <Carousel {...carouselProps} />;
}
