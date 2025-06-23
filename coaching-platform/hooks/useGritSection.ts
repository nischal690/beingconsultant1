import { useState, useEffect } from 'react';

const GRIT_SECTION_STORAGE_KEY = 'selectedGritSection';

export interface GritSection {
  id: string;
  title: string;
  timestamp: number;
}

export const useGritSection = () => {
  const [selectedSection, setSelectedSection] = useState<GritSection | null>(null);

  // Load selected section from localStorage on mount
  useEffect(() => {
    const loadSelectedSection = () => {
      try {
        const stored = localStorage.getItem(GRIT_SECTION_STORAGE_KEY);
        if (stored) {
          setSelectedSection(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load selected GRIT section:', error);
      }
    };

    loadSelectedSection();
  }, []);

  // Update localStorage when selected section changes
  const updateSelectedSection = (id: string, title: string) => {
    const section = { id, title, timestamp: Date.now() };
    try {
      localStorage.setItem(GRIT_SECTION_STORAGE_KEY, JSON.stringify(section));
      setSelectedSection(section);
    } catch (error) {
      console.error('Failed to save selected GRIT section:', error);
    }
  };

  // Clear selected section
  const clearSelectedSection = () => {
    try {
      localStorage.removeItem(GRIT_SECTION_STORAGE_KEY);
      setSelectedSection(null);
    } catch (error) {
      console.error('Failed to clear selected GRIT section:', error);
    }
  };

  return {
    selectedSection,
    updateSelectedSection,
    clearSelectedSection,
  };
};
