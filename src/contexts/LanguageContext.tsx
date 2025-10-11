import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Language, languages, saveLanguage } from '../translations/translation';
import { getInitialLanguage } from '../util/function_utils';

interface LanguageContextType {
    currentLanguage: Language;
    setCurrentLanguage: (lang: Language) => void;
    handleLanguageChange: (langId: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [currentLanguage, setCurrentLanguageState] = useState<Language>(getInitialLanguage());

    const setCurrentLanguage = (lang: Language) => {
        setCurrentLanguageState(lang);
        saveLanguage(lang);
    };

    const handleLanguageChange = (langId: string) => {
        const selectedLang = languages.find(lang => lang.id === langId);
        if (selectedLang) {
            setCurrentLanguage(selectedLang);
        }
    };

    const contextValue: LanguageContextType = {
        currentLanguage,
        setCurrentLanguage,
        handleLanguageChange,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}