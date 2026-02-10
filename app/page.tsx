import { About } from '@/components/about';
import { Experience } from '@/components/experience';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Sidebar } from '@/components/sidebar';
import { SkillsCarousel } from '@/components/skills-carousel';

export default function Home() {
    return (
        <main className="flex flex-col items-center">
            <Sidebar />
            <Hero />
            <SkillsCarousel />
            <Experience />
            <Projects />
            <About />
            <Footer />
        </main>
    );
}
