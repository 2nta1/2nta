
const { JOB_CATEGORIES } = require('./src/constants/jobCategories');
const { CATEGORY_TRANSLATIONS } = require('./src/utils/categoryTranslations');

const missing = [];
JOB_CATEGORIES.forEach(cat => {
    if (!CATEGORY_TRANSLATIONS[cat.label]) {
        missing.push(`Category: '${cat.label}'`);
    }
    cat.specialties.forEach(spec => {
        if (!CATEGORY_TRANSLATIONS[spec]) {
            missing.push(`  Specialty: '${spec}'`);
        }
    });
});

console.log('Missing Translations:', missing);

// Check specific troublesome ones
const trouble = ['المنظمات غير الربحية', 'العقارات', 'العلوم والبحث العلمي', 'الأمن والحراسة'];
trouble.forEach(t => {
    console.log(`Checking '${t}':`, !!CATEGORY_TRANSLATIONS[t]);
    if (!CATEGORY_TRANSLATIONS[t]) {
        // print char codes
        console.log(`String '${t}' codes:`, t.split('').map(c => c.charCodeAt(0)));
        // print keys in translations that resemble it?
    }
});
