// Translation mapping for locations (Countries, Provinces, Regions)

export const LOCATION_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
    // Countries
    'السعودية': { en: 'Saudi Arabia', ar: 'السعودية' },
    'مصر': { en: 'Egypt', ar: 'مصر' },
    'الإمارات': { en: 'UAE', ar: 'الإمارات' },
    'الكويت': { en: 'Kuwait', ar: 'الكويت' },
    'قطر': { en: 'Qatar', ar: 'قطر' },
    'البحرين': { en: 'Bahrain', ar: 'البحرين' },
    'عُمان': { en: 'Oman', ar: 'عُمان' },
    'الأردن': { en: 'Jordan', ar: 'الأردن' },
    'المغرب': { en: 'Morocco', ar: 'المغرب' },
    'تونس': { en: 'Tunisia', ar: 'تونس' },
    'الجزائر': { en: 'Algeria', ar: 'الجزائر' },
    'العراق': { en: 'Iraq', ar: 'العراق' },
    'لبنان': { en: 'Lebanon', ar: 'لبنان' },
    'سوريا': { en: 'Syria', ar: 'سوريا' },
    'تركيا': { en: 'Turkey', ar: 'تركيا' },
    'أخرى': { en: 'Other', ar: 'أخرى' },

    // Saudi Provinces
    'الرياض': { en: 'Riyadh', ar: 'الرياض' },
    'مكة المكرمة': { en: 'Makkah', ar: 'مكة المكرمة' },
    'المدينة المنورة': { en: 'Madinah', ar: 'المدينة المنورة' },
    'المنطقة الشرقية': { en: 'Eastern Province', ar: 'المنطقة الشرقية' },
    'عسير': { en: 'Asir', ar: 'عسير' },
    'القصيم': { en: 'Qassim', ar: 'القصيم' },
    'حائل': { en: 'Hail', ar: 'حائل' },
    'تبوك': { en: 'Tabuk', ar: 'تبوك' },
    'الباحة': { en: 'Al Bahah', ar: 'الباحة' },
    'الجوف': { en: 'Al Jouf', ar: 'الجوف' },
    'نجران': { en: 'Najran', ar: 'نجران' },
    'جازان': { en: 'Jazan', ar: 'جازان' },
    'الحدود الشمالية': { en: 'Northern Borders', ar: 'الحدود الشمالية' },

    // Egyptian Governorates
    'القاهرة': { en: 'Cairo', ar: 'القاهرة' },
    'الجيزة': { en: 'Giza', ar: 'الجيزة' },
    'الإسكندرية': { en: 'Alexandria', ar: 'الإسكندرية' },
    'القليوبية': { en: 'Qalyubia', ar: 'القليوبية' },
    'المنوفية': { en: 'Monufia', ar: 'المنوفية' },
    'الغربية': { en: 'Gharbia', ar: 'الغربية' },
    'الدقهلية': { en: 'Dakahlia', ar: 'الدقهلية' },
    'الشرقية': { en: 'Sharqia', ar: 'الشرقية' },
    'كفر الشيخ': { en: 'Kafr El Sheikh', ar: 'كفر الشيخ' },
    'البحيرة': { en: 'Beheira', ar: 'البحيرة' },
    'دمياط': { en: 'Damietta', ar: 'دمياط' },
    'بورسعيد': { en: 'Port Said', ar: 'بورسعيد' },
    'الإسماعيلية': { en: 'Ismailia', ar: 'الإسماعيلية' },
    'السويس': { en: 'Suez', ar: 'السويس' },
    'شمال سيناء': { en: 'North Sinai', ar: 'شمال سيناء' },
    'جنوب سيناء': { en: 'South Sinai', ar: 'جنوب سيناء' },
    'الفيوم': { en: 'Faiyum', ar: 'الفيوم' },
    'بني سويف': { en: 'Beni Suef', ar: 'بني سويف' },
    'المنيا': { en: 'Minya', ar: 'المنيا' },
    'أسيوط': { en: 'Asyut', ar: 'أسيوط' },
    'سوهاج': { en: 'Sohag', ar: 'سوهاج' },
    'قنا': { en: 'Qena', ar: 'قنا' },
    'الأقصر': { en: 'Luxor', ar: 'الأقصر' },
    'أسوان': { en: 'Aswan', ar: 'أسوان' },
    'الوادي الجديد': { en: 'New Valley', ar: 'الوادي الجديد' },
    'مطروح': { en: 'Matrouh', ar: 'مطروح' },
    'البحر الأحمر': { en: 'Red Sea', ar: 'البحر الأحمر' },

    // UAE Emirates
    'أبوظبي': { en: 'Abu Dhabi', ar: 'أبوظبي' },
    'دبي': { en: 'Dubai', ar: 'دبي' },
    'الشارقة': { en: 'Sharjah', ar: 'الشارقة' },
    'العين': { en: 'Al Ain', ar: 'العين' },
    'عجمان': { en: 'Ajman', ar: 'عجمان' },
    'رأس الخيمة': { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' },
    'الفجيرة': { en: 'Fujairah', ar: 'الفجيرة' },
    'أم القيوين': { en: 'Umm Al Quwain', ar: 'أم القيوين' },

    // Common Regions (Examples)
    'المعادي': { en: 'Maadi', ar: 'المعادي' },
    'مدينة نصر': { en: 'Nasr City', ar: 'مدينة نصر' },
    'مصر الجديدة': { en: 'Heliopolis', ar: 'مصر الجديدة' },
    'الزمالك': { en: 'Zamalek', ar: 'الزمالك' },
    'شبرا': { en: 'Shubra', ar: 'شبرا' },
    'التجمع': { en: 'New Cairo', ar: 'التجمع' },
    'حلوان': { en: 'Helwan', ar: 'حلوان' },
    'عين شمس': { en: 'Ain Shams', ar: 'عين شمس' },
    'الدقي': { en: 'Dokki', ar: 'الدقي' },
    'المهندسين': { en: 'Mohandessin', ar: 'المهندسين' },
    'الهرم': { en: 'Haram', ar: 'الهرم' },
    '6 أكتوبر': { en: '6th of October', ar: '6 أكتوبر' },
    'الشيخ زايد': { en: 'Sheikh Zayed', ar: 'الشيخ زايد' },
    'العجوزة': { en: 'Agouza', ar: 'العجوزة' },
    'العليا': { en: 'Olaya', ar: 'العليا' },
    'الملز': { en: 'Malaz', ar: 'الملز' },
    'النخيل': { en: 'Nakheel', ar: 'النخيل' },
    'النسيم': { en: 'Naseem', ar: 'النسيم' },
    // ... can be extended
};

export function translateLocation(text: string, locale: 'ar' | 'en'): string {
    const translation = LOCATION_TRANSLATIONS[text];
    if (translation) {
        return translation[locale];
    }
    return text;
}
