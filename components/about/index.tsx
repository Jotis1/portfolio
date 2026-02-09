import Image from 'next/image';

export function About() {
    return (
        <section className="py-24 px-8 flex flex-col gap-16 items-center justify-center">
            <header className="z-1 flex flex-col gap-3 items-center justify-center text-center">
                <h1 className="text-display-md font-display font-semibold text-primary">
                    About me
                </h1>
                <p className="text-xl text-tertiary">
                    Let's get to know each other better
                </p>
            </header>
            <div className="max-w-180 w-full flex items-center gap-8">
                <p>
                    My name is{' '}
                    <strong className="font-semibold text-brand-secondary">
                        Juan Manuel
                    </strong>{' '}
                    but I like to be called Jotis. I started programming when I
                    was very young, making discord bots for "osu!" servers.
                    <br />
                    <br />I always liked creating things and I used{' '}
                    <strong className="font-semibold text-brand-secondary">
                        code as a tool for it
                    </strong>
                    . I am not a{' '}
                    <strong className="font-semibold text-brand-secondary">
                        conformist person
                    </strong>
                    , if something can be done better I will look for a way to
                    make it possible.
                    <br />
                    <br />I like to help my colleagues and{' '}
                    <strong className="font-semibold text-brand-secondary">
                        share my knowledge
                    </strong>
                    , I believe in teamwork and camaraderie.
                </p>
                <div className="size-62 aspect-square p-1 rounded-4xl bg-primary drop-shadow-lg border border-secondary_alt">
                    <div className="relative size-full p-1 rounded-[28px] bg-primary shadow-modern-mockup-inner-sm">
                        <Image
                            alt="Profile picture"
                            src={'https://github.com/Jotis1.png'}
                            width={234}
                            height={234}
                            className="rounded-3xl bg-secondary border-2 border-utility-gray-200"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
