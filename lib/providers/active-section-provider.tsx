'use client';

import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type ActiveSectionContextType = {
    activeSection: string;
    setActiveSection: (section: string) => void;
    timeOfLastClick: number;
    setTimeOfLastClick: (time: number) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType | null>(
    null,
);

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
    const [activeSection, setActiveSectionInternal] = useState('skills');
    const [timeOfLastClick, setTimeOfLastClick] = useState(0);

    useEffect(() => {
        if (timeOfLastClick + 1000 > Date.now()) {
            return; // Ignorar observer por 1 segundo después de click
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries.find(
                    (entry) => entry.isIntersecting,
                );
                if (visibleSection?.isIntersecting) {
                    setActiveSectionInternal(visibleSection.target.id);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            },
        );

        const sectionIds = ['skills', 'experience', 'projects', 'about'];
        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [timeOfLastClick]);

    const setActiveSection = (section: string) => {
        setActiveSectionInternal(section);
        setTimeOfLastClick(Date.now());
    };

    return (
        <ActiveSectionContext.Provider
            value={{
                activeSection,
                setActiveSection,
                timeOfLastClick,
                setTimeOfLastClick,
            }}
        >
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSection() {
    const context = useContext(ActiveSectionContext);
    if (context === null) {
        throw new Error(
            'useActiveSectionContext debe usarse dentro de ActiveSectionProvider',
        );
    }
    return context;
}
