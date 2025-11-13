import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Adicionados
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
    
    const location = useLocation();
    const navigate = useNavigate();

    const setCurrentLanguage = (lang: Language) => {
        setCurrentLanguageState(lang);
        saveLanguage(lang);
    };

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const urlLangCode = pathSegments[0];

        const foundLang = languages.find(lang => lang.id === urlLangCode);

        if (foundLang && foundLang.id !== currentLanguage.id) {
            setCurrentLanguageState(foundLang);
        }
    }, [location.pathname]);
    
    const handleLanguageChange = (langId: string) => {
        const selectedLang = languages.find(lang => lang.id === langId);
        
        if (selectedLang) {
            setCurrentLanguage(selectedLang);
            const currentPath = location.pathname;
            const pathSegments = currentPath.split('/').filter(Boolean);
            
            const firstSegmentIsLang = languages.some(l => l.id === pathSegments[0]);
            
            let newPath;
            if (firstSegmentIsLang) {
                pathSegments[0] = langId;
                newPath = `/${pathSegments.join('/')}`;
            } else {
                newPath = `/${langId}${currentPath === '/' ? '' : currentPath}`;
            }

            navigate(newPath);
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