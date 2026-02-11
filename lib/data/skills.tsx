import {
    JSON as _JSON,
    AmazonWebServicesDark,
    Android,
    Angular,
    AppleDark,
    AstroDark,
    BashDark,
    BetterAuthDark,
    Biomejs,
    Bun,
    Cloudflare,
    CSS,
    Discordjs,
    Docker,
    Electron,
    ESLintDark,
    Expo,
    ExpressjsDark,
    Figma,
    Git,
    GraphQL,
    HTML5,
    JavaScript,
    Jest,
    Laravel,
    MariaDB,
    MotionDark,
    MySQLDark,
    NestJS,
    Nextjs,
    Nodejs,
    PhpDark,
    PostgreSQL,
    PowerShell,
    PrismaDark,
    Python,
    ReactDark,
    TailwindCSS,
    WordPress,
    Zod,
} from '@ridemountainpig/svgl-react';
import { Fragment } from 'react/jsx-runtime';
import { z } from 'zod';
import { skillSchema } from '@/lib/data/schema';

const skills = z.array(skillSchema).parse([
    <Fragment key={1}>
        <AmazonWebServicesDark className='size-8' />
        AWS
    </Fragment>,
    <Fragment key={2}>
        <Android className='size-8' />
        Android
    </Fragment>,
    <Fragment key={3}>
        <Angular className='size-8' />
        Angular
    </Fragment>,
    <Fragment key={4}>
        <AppleDark className='size-8' />
        Apple
    </Fragment>,
    <Fragment key={5}>
        <AstroDark className='size-8' />
        Astro
    </Fragment>,
    <Fragment key={6}>
        <BashDark className='size-8' />
        Bash
    </Fragment>,
    <Fragment key={7}>
        <BetterAuthDark className='size-8' />
        Better Auth
    </Fragment>,
    <Fragment key={8}>
        <Biomejs className='size-8' />
        Biomejs
    </Fragment>,
    <Fragment key={9}>
        <Bun className='size-8' />
        Bun
    </Fragment>,
    <Fragment key={10}>
        <Cloudflare className='size-8' />
        Cloudflare
    </Fragment>,
    <Fragment key={11}>
        <CSS className='size-8' />
        CSS
    </Fragment>,
    <Fragment key={12}>
        <Discordjs className='size-8' />
        Discord.js
    </Fragment>,
    <Fragment key={13}>
        <Docker className='size-8' />
        Docker
    </Fragment>,
    <Fragment key={14}>
        <Electron className='size-8' />
        Electron
    </Fragment>,
    <Fragment key={15}>
        <ESLintDark className='size-8' />
        ESLint
    </Fragment>,
    <Fragment key={16}>
        <Expo className='size-8' />
        Expo
    </Fragment>,
    <Fragment key={17}>
        <ExpressjsDark className='size-8' />
        Express.js
    </Fragment>,
    <Fragment key={18}>
        <Figma className='size-8' />
        Figma
    </Fragment>,
    <Fragment key={19}>
        <Git className='size-8' />
        Git
    </Fragment>,
    <Fragment key={20}>
        <GraphQL className='size-8' />
        GraphQL
    </Fragment>,
    <Fragment key={21}>
        <HTML5 className='size-8' />
        HTML5
    </Fragment>,
    <Fragment key={22}>
        <JavaScript className='size-8' />
        JavaScript
    </Fragment>,
    <Fragment key={23}>
        <Jest className='size-8' />
        Jest
    </Fragment>,
    <Fragment key={24}>
        <_JSON className='size-8' />
        JSON
    </Fragment>,
    <Fragment key={25}>
        <Laravel className='size-8' />
        Laravel
    </Fragment>,
    <Fragment key={26}>
        <MariaDB className='size-8' />
        MariaDB
    </Fragment>,
    <Fragment key={27}>
        <MotionDark className='size-8' />
        Motion
    </Fragment>,
    <Fragment key={28}>
        <MySQLDark className='size-8' />
        MySQL
    </Fragment>,
    <Fragment key={29}>
        <NestJS className='size-8' />
        NestJS
    </Fragment>,
    <Fragment key={30}>
        <Nextjs className='size-8' />
        Next.js
    </Fragment>,
    <Fragment key={31}>
        <Nodejs className='size-8' />
        Node.js
    </Fragment>,
    <Fragment key={32}>
        <PhpDark className='size-8' />
        Php
    </Fragment>,
    <Fragment key={33}>
        <PostgreSQL className='size-8' />
        PostgreSQL
    </Fragment>,
    <Fragment key={34}>
        <PowerShell className='size-8' />
        PowerShell
    </Fragment>,
    <Fragment key={35}>
        <PrismaDark className='size-8' />
        Prisma
    </Fragment>,
    <Fragment key={36}>
        <Python className='size-8' />
        Python
    </Fragment>,
    <Fragment key={37}>
        <ReactDark className='size-8' />
        React
    </Fragment>,
    <Fragment key={38}>
        <TailwindCSS className='size-8' />
        TailwindCSS
    </Fragment>,
    <Fragment key={39}>
        <WordPress className='size-8' />
        WordPress
    </Fragment>,
    <Fragment key={40}>
        <Zod className='size-8' />
        Zod
    </Fragment>,
]);

export { skills };
