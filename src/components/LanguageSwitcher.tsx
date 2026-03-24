'use client';

import { useLanguage } from '@/context/LanguageContext';
import { FiGlobe } from 'react-icons/fi';

export default function LanguageSwitcher() {
    const { locale, setLocale, isRtl } = useLanguage();

    return (
        <button
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/50 hover:bg-slate-100 text-slate-600 transition-all border border-slate-200/50 group"
        >
            <FiGlobe className={`text-lg group-hover:text-primary transition-colors ${locale === 'en' ? 'order-2' : ''}`} />
            <span className="text-xs font-black uppercase tracking-wider">
                {locale === 'ar' ? 'English' : 'عربي'}
            </span>
        </button>
    );
}
