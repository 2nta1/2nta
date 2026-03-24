'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import ar from '../i18n/dictionaries/ar.json';
import en from '../i18n/dictionaries/en.json';

type Locale = 'ar' | 'en';
type Translations = typeof ar;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    isRtl: boolean;
}

const translations: Record<Locale, Translations> = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        } else if (typeof window !== 'undefined') {
            // Default to Arabic for this specific app as requested usually, or detect browser
            setLocaleState('ar');
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let result: any = translations[locale];

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key; // return the key if not found
            }
        }

        return result as string;
    };

    const isRtl = locale === 'ar';

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, isRtl }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
