import { Carousel } from '@/components/base/carousel';
import { data } from '@/lib/data';

export function SkillsCarousel() {
    const skills = data.skills ?? [];
    return (
        <section
            id='skills'
            className='w-full'
        >
            <Carousel
                items={skills}
                aria-label='Skills carousel'
            />
        </section>
    );
}
