// Translation mapping for job categories and specialties
// This is a helper to translate dropdown values dynamically

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
    // Main Categories
    'الهندسة': { en: 'Engineering', ar: 'الهندسة' },
    'تقنية المعلومات': { en: 'Information Technology', ar: 'تقنية المعلومات' },
    'الصحة والطب': { en: 'Health & Medicine', ar: 'الصحة والطب' },
    'التعليم': { en: 'Education', ar: 'التعليم' },
    'المحاسبة والمالية': { en: 'Accounting & Finance', ar: 'المحاسبة والمالية' },
    'التسويق والمبيعات': { en: 'Marketing & Sales', ar: 'التسويق والمبيعات' },
    'الإدارة': { en: 'Management', ar: 'الإدارة' },
    'القانون': { en: 'Law', ar: 'القانون' },
    'التصميم والإبداع': { en: 'Design & Creativity', ar: 'التصميم والإبداع' },
    'الضيافة والسياحة': { en: 'Hospitality & Tourism', ar: 'الضيافة والسياحة' },
    'سلاسل الإمداد واللوجستيات': { en: 'Supply Chain & Logistics', ar: 'سلاسل الإمداد واللوجستيات' },
    'البناء والتشييد': { en: 'Construction', ar: 'البناء والتشييد' },
    'الإعلام والترفيه': { en: 'Media & Entertainment', ar: 'الإعلام والترفيه' },
    'الزراعة': { en: 'Agriculture', ar: 'الزراعة' },
    'المنظمات غير الربحية': { en: 'Non-profit Organizations', ar: 'المنظمات غير الربحية' },
    'العقارات': { en: 'Real Estate', ar: 'العقارات' },
    'العلوم والبحث العلمي': { en: 'Science & Research', ar: 'العلوم والبحث العلمي' },
    'الأمن والحراسة': { en: 'Security & Guarding', ar: 'الأمن والحراسة' },

    // IT Specialties
    'مهندس برمجيات': { en: 'Software Engineer', ar: 'مهندس برمجيات' },
    'مطور واجهات': { en: 'Frontend Developer', ar: 'مطور واجهات' },
    'مطور باك-إند': { en: 'Backend Developer', ar: 'مطور باك-إند' },
    'مطور تطبيقات موبايل': { en: 'Mobile App Developer', ar: 'مطور تطبيقات موبايل' },
    'مطور Full-Stack': { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    'مطور ألعاب': { en: 'Game Developer', ar: 'مطور ألعاب' },
    'مهندس بيانات': { en: 'Data Engineer', ar: 'مهندس بيانات' },
    'محلل بيانات': { en: 'Data Analyst', ar: 'محلل بيانات' },
    'مسؤول قواعد بيانات': { en: 'Database Administrator', ar: 'مسؤول قواعد بيانات' },
    'مهندس شبكات': { en: 'Network Engineer', ar: 'مهندس شبكات' },
    'مهندس DevOps': { en: 'DevOps Engineer', ar: 'مهندس DevOps' },
    'محلل نظم': { en: 'Systems Analyst', ar: 'محلل نظم' },
    'أخصائي أمن معلومات': { en: 'Information Security Specialist', ar: 'أخصائي أمن معلومات' },
    'مهندس ذكاء اصطناعي': { en: 'AI Engineer', ar: 'مهندس ذكاء اصطناعي' },
    'مهندس تعلم آلي': { en: 'Machine Learning Engineer', ar: 'مهندس تعلم آلي' },

    // Engineering Specialties
    'مهندس ميكانيكا': { en: 'Mechanical Engineer', ar: 'مهندس ميكانيكا' },
    'مهندس كهرباء': { en: 'Electrical Engineer', ar: 'مهندس كهرباء' },
    'مهندس مدني': { en: 'Civil Engineer', ar: 'مهندس مدني' },
    'مهندس كيمياء': { en: 'Chemical Engineer', ar: 'مهندس كيمياء' },
    'مهندس صناعي': { en: 'Industrial Engineer', ar: 'مهندس صناعي' },
    'مهندس بيئة': { en: 'Environmental Engineer', ar: 'مهندس بيئة' },
    'مهندس معادن': { en: 'Metallurgical Engineer', ar: 'مهندس معادن' },
    'مهندس طيران': { en: 'Aerospace Engineer', ar: 'مهندس طيران' },
    'مهندس اتصالات': { en: 'Telecommunications Engineer', ar: 'مهندس اتصالات' },
    'مهندس بحرية': { en: 'Marine Engineer', ar: 'مهندس بحرية' },
    'مهندس نووي': { en: 'Nuclear Engineer', ar: 'مهندس نووي' },
    'مهندس بترول': { en: 'Petroleum Engineer', ar: 'مهندس بترول' },
    'مهندس تحكم آلي': { en: 'Control Engineer', ar: 'مهندس تحكم آلي' },

    // Medical Specialties
    'طبيب عام': { en: 'General Practitioner', ar: 'طبيب عام' },
    'طبيب باطنية': { en: 'Internist', ar: 'طبيب باطنية' },
    'طبيب جراحة': { en: 'Surgeon', ar: 'طبيب جراحة' },
    'طبيب أسنان': { en: 'Dentist', ar: 'طبيب أسنان' },
    'صيدلي': { en: 'Pharmacist', ar: 'صيدلي' },
    'ممرض': { en: 'Nurse', ar: 'ممرض' },
    'قابلة': { en: 'Midwife', ar: 'قابلة' },
    'أخصائي أشعة': { en: 'Radiologist', ar: 'أخصائي أشعة' },
    'أخصائي مختبر': { en: 'Lab Technician', ar: 'أخصائي مختبر' },
    'أخصائي علاج طبيعي': { en: 'Physiotherapist', ar: 'أخصائي علاج طبيعي' },
    'أخصائي تغذية': { en: 'Nutritionist', ar: 'أخصائي تغذية' },
    'طبيب بيطري': { en: 'Veterinarian', ar: 'طبيب بيطري' },
    'أخصائي تخدير': { en: 'Anesthesiologist', ar: 'أخصائي تخدير' },

    // Education Specialties
    'معلم رياض أطفال': { en: 'Kindergarten Teacher', ar: 'معلم رياض أطفال' },
    'معلم ابتدائي': { en: 'Primary Teacher', ar: 'معلم ابتدائي' },
    'معلم ثانوي': { en: 'Secondary Teacher', ar: 'معلم ثانوي' },
    'أخصائي تعليم خاص': { en: 'Special Education Specialist', ar: 'أخصائي تعليم خاص' },
    'منسق مناهج': { en: 'Curriculum Coordinator', ar: 'منسق مناهج' },
    'مستشار أكاديمي': { en: 'Academic Advisor', ar: 'مستشار أكاديمي' },
    'محاضر جامعي': { en: 'Lecturer', ar: 'محاضر جامعي' },
    'مدرب مهني': { en: 'Vocational Trainer', ar: 'مدرب مهني' },
    'مدير مدرسة': { en: 'School Principal', ar: 'مدير مدرسة' },

    // Business Specialties
    'محاسب': { en: 'Accountant', ar: 'محاسب' },
    'محاسب تكاليف': { en: 'Cost Accountant', ar: 'محاسب تكاليف' },
    'مدقق مالي': { en: 'Auditor', ar: 'مدقق مالي' },
    'محلل مالي': { en: 'Financial Analyst', ar: 'محلل مالي' },
    'خبير ضرائب': { en: 'Tax Expert', ar: 'خبير ضرائب' },
    'مدير مالي': { en: 'Financial Manager', ar: 'مدير مالي' },
    'أمين خزينة': { en: 'Treasurer', ar: 'أمين خزينة' },
    'مدير مشروع': { en: 'Project Manager', ar: 'مدير مشروع' },
    'مدير عمليات': { en: 'Operations Manager', ar: 'مدير عمليات' },
    'مدير موارد بشرية': { en: 'HR Manager', ar: 'مدير موارد بشرية' },

    // Marketing Specialties
    'أخصائي تسويق رقمي': { en: 'Digital Marketing Specialist', ar: 'أخصائي تسويق رقمي' },
    'كاتب محتوى': { en: 'Content Writer', ar: 'كاتب محتوى' },
    'باحث سوق': { en: 'Market Researcher', ar: 'باحث سوق' },
    'مدير حسابات إعلانات': { en: 'Ad Account Manager', ar: 'مدير حسابات إعلانات' },
    'مدير علاقات عامة': { en: 'PR Manager', ar: 'مدير علاقات عامة' },
    'مدير مبيعات': { en: 'Sales Manager', ar: 'مدير مبيعات' },
    'مندوب مبيعات': { en: 'Sales Representative', ar: 'مندوب مبيعات' },
    'مدير تسويق': { en: 'Marketing Manager', ar: 'مدير تسويق' },

    // Management Specialties
    'مدير عام': { en: 'General Manager', ar: 'مدير عام' },
    'مستشار إداري': { en: 'Management Consultant', ar: 'مستشار إداري' },
    'محلل أعمال': { en: 'Business Analyst', ar: 'محلل أعمال' },
    'مدير مكتب': { en: 'Office Manager', ar: 'مدير مكتب' },
    'سكرتير تنفيذي': { en: 'Executive Secretary', ar: 'سكرتير تنفيذي' },

    // Legal Specialties
    'محام شركات': { en: 'Corporate Lawyer', ar: 'محام شركات' },
    'محامي عقود': { en: 'Contract Lawyer', ar: 'محامي عقود' },
    'محامي جنائي': { en: 'Criminal Lawyer', ar: 'محامي جنائي' },
    'محامي أحوال شخصية': { en: 'Family Lawyer', ar: 'محامي أحوال شخصية' },
    'مستشار قانوني': { en: 'Legal Consultant', ar: 'مستشار قانوني' },
    'كاتب عدل': { en: 'Notary Public', ar: 'كاتب عدل' },
    'باحث قانوني': { en: 'Legal Researcher', ar: 'باحث قانوني' },
    'محكم قانوني': { en: 'Legal Arbitrator', ar: 'محكم قانوني' },

    // Design Specialties  
    'مصمم جرافيك': { en: 'Graphic Designer', ar: 'مصمم جرافيك' },
    'مصمم موشن جرافيك': { en: 'Motion Graphics Designer', ar: 'مصمم موشن جرافيك' },
    'مصمم تجربة مستخدم': { en: 'UX Designer', ar: 'مصمم تجربة مستخدم' },
    'مصمم داخلي': { en: 'Interior Designer', ar: 'مصمم داخلي' },
    'مصمم أزياء': { en: 'Fashion Designer', ar: 'مصمم أزياء' },
    'رسام': { en: 'Illustrator', ar: 'رسام' },
    'مصور': { en: 'Photographer', ar: 'مصور' },
    'محرر فيديو': { en: 'Video Editor', ar: 'محرر فيديو' },

    // Hospitality Specialties
    'مدير فندق': { en: 'Hotel Manager', ar: 'مدير فندق' },
    'مدير مطعم': { en: 'Restaurant Manager', ar: 'مدير مطعم' },
    'موظف استقبال': { en: 'Receptionist', ar: 'موظف استقبال' },
    'مضيف طيران': { en: 'Flight Attendant', ar: 'مضيف طيران' },
    'منسق فعاليات': { en: 'Event Coordinator', ar: 'منسق فعاليات' },
    'مرشد سياحي': { en: 'Tour Guide', ar: 'مرشد سياحي' },
    'شيف': { en: 'Chef', ar: 'شيف' },
    'نادل': { en: 'Waiter', ar: 'نادل' },

    // Logistics Specialties
    'مسؤول مخزون': { en: 'Inventory Manager', ar: 'مسؤول مخزون' },
    'مشرف مستودع': { en: 'Warehouse Supervisor', ar: 'مشرف مستودع' },
    'مخطط سلسلة التوريد': { en: 'Supply Chain Planner', ar: 'مخطط سلسلة التوريد' },
    'منسق شحن': { en: 'Shipping Coordinator', ar: 'منسق شحن' },
    'مسؤول جمركي': { en: 'Customs Officer', ar: 'مسؤول جمركي' },
    'سائق شاحنة': { en: 'Truck Driver', ar: 'سائق شاحنة' },
    'مراقب شحن': { en: 'Cargo Controller', ar: 'مراقب شحن' },

    // Construction Specialties
    'مهندس سلامة موقع': { en: 'Site Safety Engineer', ar: 'مهندس سلامة موقع' },
    'مشرف موقع': { en: 'Site Supervisor', ar: 'مشرف موقع' },
    'نجار': { en: 'Carpenter', ar: 'نجار' },
    'سباك': { en: 'Plumber', ar: 'سباك' },
    'كهربائي موقع': { en: 'Site Electrician', ar: 'كهربائي موقع' },
    'عامل بناء': { en: 'Construction Worker', ar: 'عامل بناء' },
    'مسّاح كميات': { en: 'Quantity Surveyor', ar: 'مسّاح كميات' },
    'مقاول فرعي': { en: 'Subcontractor', ar: 'مقاول فرعي' },

    // Media Specialties
    'محرر': { en: 'Editor', ar: 'محرر' },
    'كاتب سيناريو': { en: 'Screenwriter', ar: 'كاتب سيناريو' },
    'صحفي': { en: 'Journalist', ar: 'صحفي' },
    'منتج محتوى رقمي': { en: 'Digital Content Producer', ar: 'منتج محتوى رقمي' },
    'مذيع': { en: 'Broadcaster', ar: 'مذيع' },
    'مدير وسائل التواصل الاجتماعي': { en: 'Social Media Manager', ar: 'مدير وسائل التواصل الاجتماعي' },
    'منتج تلفزيوني': { en: 'TV Producer', ar: 'منتج تلفزيوني' },
    'مصمم صوت': { en: 'Sound Designer', ar: 'مصمم صوت' },

    // Agriculture Specialties
    'مهندس زراعي': { en: 'Agricultural Engineer', ar: 'مهندس زراعي' },
    'مهندس ري': { en: 'Irrigation Engineer', ar: 'مهندس ري' },
    'عامل حقل': { en: 'Field Worker', ar: 'عامل حقل' },
    'مشرف دفيئة': { en: 'Greenhouse Supervisor', ar: 'مشرف دفيئة' },
    'فني ري': { en: 'Irrigation Technician', ar: 'فني ري' },
    'تقني غذائي': { en: 'Food Technologist', ar: 'تقني غذائي' },
    'خبير إنتاج حيواني': { en: 'Animal Production Expert', ar: 'خبير إنتاج حيواني' },

    // NGO Specialties
    'مسؤول برامج': { en: 'Program Officer', ar: 'مسؤول برامج' },
    'مدير مشروع خيري': { en: 'Charity Project Manager', ar: 'مدير مشروع خيري' },
    'مسؤول علاقات مانحين': { en: 'Donor Relations Officer', ar: 'مسؤول علاقات مانحين' },
    'ميسر مجتمعي': { en: 'Community Facilitator', ar: 'ميسر مجتمعي' },
    'جامع تبرعات': { en: 'Fundraiser', ar: 'جامع تبرعات' },
    'منسق تطوع': { en: 'Volunteer Coordinator', ar: 'منسق تطوع' },
    'مدير تطوير': { en: 'Development Manager', ar: 'مدير تطوير' },

    // Real Estate Specialties
    'وكيل عقارات': { en: 'Real Estate Agent', ar: 'وكيل عقارات' },
    'مقيم عقاري': { en: 'Real Estate Appraiser', ar: 'مقيم عقاري' },
    'مدير أملاك': { en: 'Property Manager', ar: 'مدير أملاك' },
    'أخصائي تسويق عقاري': { en: 'Real Estate Marketing Specialist', ar: 'أخصائي تسويق عقاري' },
    'مستشار استثمار عقاري': { en: 'Real Estate Investment Consultant', ar: 'مستشار استثمار عقاري' },
    'مدير مبيعات عقارية': { en: 'Real Estate Sales Manager', ar: 'مدير مبيعات عقارية' },

    // Customer Service Specialties
    'ممثل خدمة عملاء': { en: 'Customer Service Representative', ar: 'ممثل خدمة عملاء' },
    'أخصائي دعم فني': { en: 'Technical Support Specialist', ar: 'أخصائي دعم فني' },
    'مدير نجاح العملاء': { en: 'Customer Success Manager', ar: 'مدير نجاح العملاء' },
    'مسؤول مركز اتصال': { en: 'Call Center Officer', ar: 'مسؤول مركز اتصال' },
    'أخصائي علاقات عملاء': { en: 'Customer Relations Specialist', ar: 'أخصائي علاقات عملاء' },
    'مشرف خدمة عملاء': { en: 'Customer Service Supervisor', ar: 'مشرف خدمة عملاء' },

    // Science Specialties
    'باحث علمي': { en: 'Scientific Researcher', ar: 'باحث علمي' },
    'فني مختبر كيميائي': { en: 'Chemical Lab Technician', ar: 'فني مختبر كيميائي' },
    'عالم أحياء': { en: 'Biologist', ar: 'عالم أحياء' },
    'أخصائي فيزياء': { en: 'Physicist', ar: 'أخصائي فيزياء' },
    'باحث اجتماعي': { en: 'Social Researcher', ar: 'باحث اجتماعي' },
    'محلل إحصائي': { en: 'Statistical Analyst', ar: 'محلل إحصائي' },
    'عالم بيانات': { en: 'Data Scientist', ar: 'عالم بيانات' },
    'أخصائي جودة مختبرات': { en: 'Lab Quality Specialist', ar: 'أخصائي جودة مختبرات' },

    // Security Specialties
    'حارس أمن': { en: 'Security Guard', ar: 'حارس أمن' },
    'مشرف أمن': { en: 'Security Supervisor', ar: 'مشرف أمن' },
    'مدير أمن منشآت': { en: 'Facility Security Manager', ar: 'مدير أمن منشآت' },
    'أخصائي سلامة وصحة مهنية': { en: 'Occupational Health & Safety Specialist', ar: 'أخصائي سلامة وصحة مهنية' },
    'مسؤول مراقبة كاميرات': { en: 'CCTV Operator', ar: 'مسؤول مراقبة كاميرات' },
    'أخصائي حماية شخصية': { en: 'Bodyguard', ar: 'أخصائي حماية شخصية' },

    // Soft Skills
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
    'التعلم الذاتي': { en: 'Self-Learning', ar: 'التعلم الذاتي' },
    'اتخاذ القرار': { en: 'Decision Making', ar: 'اتخاذ القرار' },
    'الابتكار': { en: 'Innovation', ar: 'الابتكار' },
    'العمل تحت الضغط': { en: 'Working Under Pressure', ar: 'العمل تحت الضغط' },
    'إدارة المشاريع': { en: 'Project Management', ar: 'إدارة المشاريع' },
    'التخطيط الاستراتيجي': { en: 'Strategic Planning', ar: 'التخطيط الاستراتيجي' },
    'مهارات العرض': { en: 'Presentation Skills', ar: 'مهارات العرض' },
    'المسؤولية': { en: 'Responsibility', ar: 'المسؤولية' },
    'التعايش مع التغيير': { en: 'Adaptability', ar: 'التعايش مع التغيير' },
    'خدمة العملاء': { en: 'Customer Service', ar: 'خدمة العملاء' },

    // Common Benefits
    'تأمين طبي': { en: 'Health Insurance', ar: 'تأمين طبي' },
    'تأمين اجتماعي': { en: 'Social Insurance', ar: 'تأمين اجتماعي' },
    'بدل مواصلات': { en: 'Transportation Allowance', ar: 'بدل مواصلات' },
    'بدل نقل': { en: 'Transportation Allowance', ar: 'بدل نقل' },
    'بدل سكن': { en: 'Housing Allowance', ar: 'بدل سكن' },
    'مكافآت سنوية': { en: 'Annual Bonus', ar: 'مكافآت سنوية' },
    'مكافآت أداء': { en: 'Performance Bonuses', ar: 'مكافآت أداء' },
    'عمل عن بعد': { en: 'Remote Work', ar: 'عمل عن بعد' },
    'عمل عن بُعد جزئي': { en: 'Partial Remote Work', ar: 'عمل عن بُعد جزئي' },
    'ساعات عمل مرنة': { en: 'Flexible Hours', ar: 'ساعات عمل مرنة' },
    'وجبات مجانية': { en: 'Free Meals', ar: 'وجبات مجانية' },
    'جيم رياضي': { en: 'Gym Membership', ar: 'جيم رياضي' },
    'عضوية نادي رياضي': { en: 'Gym Membership', ar: 'عضوية نادي رياضي' },
    'إجازة مدفوعة': { en: 'Paid Time Off', ar: 'إجازة مدفوعة' },
    'إجازة مدفوعة إضافية': { en: 'Additional Paid Leave', ar: 'إجازة مدفوعة إضافية' },
    'تدريب وتطوير': { en: 'Training & Development', ar: 'تدريب وتطوير' },
    'ميزانية تدريب': { en: 'Training Budget', ar: 'ميزانية تدريب' },
    'تأمين أسنان': { en: 'Dental Insurance', ar: 'تأمين أسنان' },
    'تأمين حياة': { en: 'Life Insurance', ar: 'تأمين حياة' },
    'بدل هاتف': { en: 'Phone Allowance', ar: 'بدل هاتف' },
    'بدل إنترنت': { en: 'Internet Allowance', ar: 'بدل إنترنت' },
    'أسهم أو خيارات أسهم': { en: 'Stock Options', ar: 'أسهم أو خيارات أسهم' },
    'منح دراسية للأبناء': { en: 'Education Allowance for Children', ar: 'منح دراسية للأبناء' },

    // Company Culture
    'بيئة عمل مرنة': { en: 'Flexible Environment', ar: 'بيئة عمل مرنة' },
    'بيئة عمل تنافسية': { en: 'Competitive Environment', ar: 'بيئة عمل تنافسية' },
    'بيئة عمل تعاونية': { en: 'Collaborative Environment', ar: 'بيئة عمل تعاونية' },
    'بيئة عمل رسمية': { en: 'Formal Environment', ar: 'بيئة عمل رسمية' },
    'بيئة عمل ابتكارية': { en: 'Innovative Environment', ar: 'بيئة عمل ابتكارية' },
    'شركات ناشئة': { en: 'Startup Culture', ar: 'شركات ناشئة' },
    'شركات متعددة الجنسيات': { en: 'Multinational Culture', ar: 'شركات متعددة الجنسيات' },
    'ثقافة ناشئة (Startup)': { en: 'Startup Culture', ar: 'ثقافة ناشئة (Startup)' },
    'هيكلية (Corporate)': { en: 'Corporate Structure', ar: 'هيكلية (Corporate)' },
    'مرنة / عن بُعد': { en: 'Flexible / Remote', ar: 'مرنة / عن بُعد' },
    'موجهة بالمهام': { en: 'Task-Oriented', ar: 'موجهة بالمهام' },
    'مبتكرة / R&D': { en: 'Innovative / R&D', ar: 'مبتكرة / R&D' },

    // Career Paths
    'مسار تقني': { en: 'Technical Path', ar: 'مسار تقني' },
    'مسار إداري': { en: 'Management Path', ar: 'مسار إداري' },
    'مسار استشاري': { en: 'Consulting Path', ar: 'مسار استشاري' },
    'مسار أكاديمي': { en: 'Academic Path', ar: 'مسار أكاديمي' },
    'مسار ريادة أعمال': { en: 'Entrepreneurship Path', ar: 'مسار ريادة أعمال' },
    'ترقية إلى Senior خلال 2 سنة': { en: 'Promotion to Senior in 2 Years', ar: 'ترقية إلى Senior خلال 2 سنة' },
    'ترقية إلى Lead خلال 3 سنوات': { en: 'Promotion to Lead in 3 Years', ar: 'ترقية إلى Lead خلال 3 سنوات' },
    'مسار إدارة فريق': { en: 'Team Management Path', ar: 'مسار إدارة فريق' },
    'مسار فني متخصص': { en: 'Technical Specialist Path', ar: 'مسار فني متخصص' },

    // Common Technical Skills
    'جافا سكريبت': { en: 'JavaScript', ar: 'جافا سكريبت' },
    'تايب سكريبت': { en: 'TypeScript', ar: 'تايب سكريبت' },
    'بايثون': { en: 'Python', ar: 'بايثون' },
    'جافا': { en: 'Java', ar: 'جافا' },
    'سي شارب': { en: 'C#', ar: 'سي شارب' },
    'بي إتش بي': { en: 'PHP', ar: 'بي إتش بي' },
    'سويفت': { en: 'Swift', ar: 'سويفت' },
    'كوتلين': { en: 'Kotlin', ar: 'كوتلين' },
    'روبي': { en: 'Ruby', ar: 'روبي' },
    'جو': { en: 'Go', ar: 'جو' },
    'راست': { en: 'Rust', ar: 'راست' },
    'سي ++': { en: 'C++', ar: 'سي ++' },
    'إس كيو إل': { en: 'SQL', ar: 'إس كيو إل' },
    'نو إس كيو إل': { en: 'NoSQL', ar: 'نو إس كيو إل' },
    'رياكت': { en: 'React', ar: 'رياكت' },
    'أنجولار': { en: 'Angular', ar: 'أنجولار' },
    'فيو': { en: 'Vue.js', ar: 'فيو' },
    'نود جي إس': { en: 'Node.js', ar: 'نود جي إس' },
    'جانغو': { en: 'Django', ar: 'جانغو' },
    'فلاسك': { en: 'Flask', ar: 'فلاسك' },
    'سبرينج': { en: 'Spring Boot', ar: 'سبرينج' },
    'دوت نت': { en: '.NET', ar: 'دوت نت' },
    'لارافيل': { en: 'Laravel', ar: 'لارافيل' },
    'ووردبريس': { en: 'WordPress', ar: 'ووردبريس' },
    'فوتوشوب': { en: 'Photoshop', ar: 'فوتوشوب' },
    'إليستريتور': { en: 'Illustrator', ar: 'إليستريتور' },
    'إكس دي': { en: 'Adobe XD', ar: 'إكس دي' },
    'فيجما': { en: 'Figma', ar: 'فيجما' },
    'أوتوكاد': { en: 'AutoCAD', ar: 'أوتوكاد' },
    'ريفيت': { en: 'Revit', ar: 'ريفيت' },
    'مايكروسوفت أوفيس': { en: 'Microsoft Office', ar: 'مايكروسوفت أوفيس' },
    'إكسل': { en: 'Excel', ar: 'إكسل' },
};

// Helper function to translate text
export function translateText(text: string, locale: 'ar' | 'en'): string {
    const translation = CATEGORY_TRANSLATIONS[text];
    if (translation) {
        return translation[locale];
    }
    // If no translation found, return original text
    return text;
}

// Helper to translate an array of text
export function translateArray(arr: string[], locale: 'ar' | 'en'): string[] {
    return arr.map(item => translateText(item, locale));
}
