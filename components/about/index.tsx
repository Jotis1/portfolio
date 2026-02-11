import Image from 'next/image';
import { data } from '@/lib/data';

export function About() {
    const { name, about, avatar } = data.user;

    return (
        <section
            id='about'
            className='py-24 lg:px-8 px-4 flex flex-col gap-16 items-center justify-center max-w-180 w-full mx-auto'
            aria-labelledby='about'
        >
            <header className='flex flex-col gap-3 text-center'>
                <h1 className='text-display-md font-display font-semibold text-primary'>
                    About me
                </h1>
                <p className='text-xl text-tertiary'>
                    Let's get to know each other better
                </p>
            </header>
            <div className='w-full flex flex-col lg:flex-row items-center gap-8'>
                <div className='prose prose-tertiary max-w-2xl'>
                    <p>{about}</p>
                </div>
                <figure className='size-62 aspect-square p-1 rounded-4xl bg-primary drop-shadow-lg border border-secondary_alt shrink-0'>
                    <div className='relative size-full p-1 rounded-[28px] bg-primary shadow-modern-mockup-inner-sm'>
                        <Image
                            src={avatar}
                            alt={`Profile picture of ${name}`}
                            width={234}
                            height={234}
                            sizes='(max-width: 1024px) 100vw, 234px'
                            className='rounded-3xl bg-secondary border-2 border-utility-gray-200 object-cover'
                            priority={false}
                        />
                    </div>
                </figure>
            </div>
        </section>
    );
}
