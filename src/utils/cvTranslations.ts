
export const WORKPLACE_TRANS: Record<string, { en: string; ar: string }> = {
    'مكتب': { en: 'Office', ar: 'مكتب' },
    'عن بعد': { en: 'Remote', ar: 'عن بعد' },
    'عن بُعد': { en: 'Remote', ar: 'عن بُعد' },
    'مختلط (مكتب و عن بعد)': { en: 'Hybrid', ar: 'مختلط (مكتب و عن بعد)' },
    'هجين': { en: 'Hybrid', ar: 'هجين' },
    'مصنع': { en: 'Factory', ar: 'مصنع' },
    'مطعم': { en: 'Restaurant', ar: 'مطعم' },
    'متجر': { en: 'Store', ar: 'متجر' },
    'مكتب طبي': { en: 'Medical Office', ar: 'مكتب طبي' },
    'مكتب محاماة': { en: 'Law Firm', ar: 'مكتب محاماة' },
    'مكتب هندسي': { en: 'Engineering Firm', ar: 'مكتب هندسي' },
    'مكتب تصميم': { en: 'Design Studio', ar: 'مكتب تصميم' },
    'من المكتب': { en: 'Office', ar: 'من المكتب' }
};

export const EDUCATION_TRANS: Record<string, { en: string; ar: string }> = {
    'ثانوية': { en: 'High School', ar: 'ثانوية' },
    'دبلوم': { en: 'Diploma', ar: 'دبلوم' },
    'بكالوريوس': { en: 'Bachelor', ar: 'بكالوريوس' },
    'ماجستير': { en: 'Master', ar: 'ماجستير' },
    'دكتوراه': { en: 'PhD', ar: 'دكتوراه' },
};

export const JOB_TYPE_TRANS: Record<string, { en: string; ar: string }> = {
    'دوام كامل': { en: 'Full Time', ar: 'دوام كامل' },
    'دوام جزئي': { en: 'Part Time', ar: 'دوام جزئي' },
    'عمل عن بعد': { en: 'Remote Work', ar: 'عمل عن بعد' },
    'عمل مؤقت': { en: 'Temporary', ar: 'عمل مؤقت' },
    'عمل مرن': { en: 'Flexible', ar: 'عمل مرن' },
};

export const EMP_TYPE_TRANS: Record<string, { en: string; ar: string }> = {
    'دوام كامل': { en: 'Full Time', ar: 'دوام كامل' }, // Duplicate because of overlapping constants/usage
    'دوام جزئي': { en: 'Part Time', ar: 'دوام جزئي' },
    'عن بعد': { en: 'Remote', ar: 'عن بعد' },
    'متدرب': { en: 'Intern', ar: 'متدرب' },
    'مستقل': { en: 'Freelance', ar: 'مستقل' },
    'موظف': { en: 'Employee', ar: 'موظف' },
    'طالب': { en: 'Student', ar: 'طالب' },
};

export const EXPERIENCE_TRANS: Record<string, { en: string; ar: string }> = {
    'مبتدئ': { en: 'Entry Level', ar: 'مبتدئ' },
    'متوسط': { en: 'Mid Level', ar: 'متوسط' },
    'متقدم': { en: 'Senior Level', ar: 'متقدم' },
    'خبير': { en: 'Expert', ar: 'خبير' },
    'بدون خبرة': { en: 'No Experience', ar: 'بدون خبرة' },
    'أقل من سنة': { en: 'Less than 1 year', ar: 'أقل من سنة' },
    '1-2 سنوات': { en: '1-2 Years', ar: '1-2 سنوات' },
    '2-3 سنوات': { en: '2-3 Years', ar: '2-3 سنوات' },
    '3-5 سنوات': { en: '3-5 Years', ar: '3-5 سنوات' },
    '5-7 سنوات': { en: '5-7 Years', ar: '5-7 سنوات' },
    '7-10 سنوات': { en: '7-10 Years', ar: '7-10 سنوات' },
    'أكثر من 10 سنوات': { en: 'More than 10 years', ar: 'أكثر من 10 سنوات' },
};

export const CAREER_PATH_TRANS: Record<string, { en: string; ar: string }> = {
    'تقني': { en: 'Technical', ar: 'تقني' },
    'إداري': { en: 'Administrative', ar: 'إداري' },
    'قيادي': { en: 'Leadership', ar: 'قيادي' },
    'إبداعي': { en: 'Creative', ar: 'إبداعي' },
    'أكاديمي': { en: 'Academic', ar: 'أكاديمي' },
    'ترقية إلى Senior خلال 2 سنة': { en: 'Promotion to Senior in 2 Years', ar: 'ترقية إلى Senior خلال 2 سنة' },
    'ترقية إلى Lead خلال 3 سنوات': { en: 'Promotion to Lead in 3 Years', ar: 'ترقية إلى Lead خلال 3 سنوات' },
    'مسار إدارة فريق': { en: 'Team Management Path', ar: 'مسار إدارة فريق' },
    'مسار فني متخصص': { en: 'Technical Specialist Path', ar: 'مسار فني متخصص' },
};

export const SOFT_SKILLS_TRANS: Record<string, { en: string; ar: string }> = {
    'التواصل': { en: 'Communication', ar: 'التواصل' },
    'العمل الجماعي': { en: 'Teamwork', ar: 'العمل الجماعي' },
    'حل المشكلات': { en: 'Problem Solving', ar: 'حل المشكلات' },
    'القيادة': { en: 'Leadership', ar: 'القيادة' },
    'إدارة الوقت': { en: 'Time Management', ar: 'إدارة الوقت' },
    'التفكير النقدي': { en: 'Critical Thinking', ar: 'التفكير النقدي' },
    'المرونة': { en: 'Flexibility', ar: 'المرونة' },
    'الإبداع': { en: 'Creativity', ar: 'الإبداع' },
    'التفاوض': { en: 'Negotiation', ar: 'التفاوض' },
    'الانتباه للتفاصيل': { en: 'Attention to Detail', ar: 'الانتباه للتفاصيل' },
    'التعلم الذاتي': { en: 'Self Learning', ar: 'التعلم الذاتي' },
    'اتخاذ القرار': { en: 'Decision Making', ar: 'اتخاذ القرار' },
    'الابتكار': { en: 'Innovation', ar: 'الابتكار' },
    'العمل تحت الضغط': { en: 'Working Under Pressure', ar: 'العمل تحت الضغط' },
    'إدارة المشاريع': { en: 'Project Management', ar: 'إدارة المشاريع' },
    'التخطيط الاستراتيجي': { en: 'Strategic Planning', ar: 'التخطيط الاستراتيجي' },
    'مهارات العرض': { en: 'Presentation Skills', ar: 'مهارات العرض' },
    'المسؤولية': { en: 'Responsibility', ar: 'المسؤولية' },
    'التعايش مع التغيير': { en: 'Adaptability', ar: 'التعايش مع التغيير' },
    'خدمة العملاء': { en: 'Customer Service', ar: 'خدمة العملاء' },

};

export function translateConstant(value: string, map: Record<string, { en: string; ar: string }>, locale: 'en' | 'ar'): string {
    if (!value) return value;
    const entry = map[value];
    if (entry) return entry[locale];
    return value; // Fallback to original if not found
}
