'use client';
import { Loading02 } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CV() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cv.pdf');
    });

    return (
        <main className='h-dvh flex flex-col gap-5 items-center justify-center'>
            <Loading02 className='animate-spin text-brand-tertiary' />
            <div className='flex-col gap-3 items-center justify-center text-center'>
                <h1 className='text-display-md font-semibold font-display text-primary'>
                    Ya casi estás
                </h1>
                <p className='text-xl'>Te estamos redirigiendo...</p>
            </div>
        </main>
    );
}
