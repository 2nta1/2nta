export interface SkillGroups {
  tech: string[];
  languages: string[];
  soft: string[];
}

// يمكن توسيع القوائم لاحقًا لكل مجال بدقة أكبر
export const SKILLS: Record<string, SkillGroups> = {
  'تقنية المعلومات': {
    tech: [
      'جافاسكريبت',
      'بايثون',
      'جافا',
      'C#',
      'C++',
      'PHP',
      'Ruby',
      'Kotlin',
      'Swift',
      'TypeScript',
      'React',
      'Angular',
      'Vue.js',
      'Node.js',
      'Spring',
      'Django',
      'Laravel',
      'SQL',
      'NoSQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Git',
      'Linux',
      'Odoo',
      'Zoho',
      'Microsoft Dynamics',
      'SAP HANA',
      'ERP Systems',
    ],
    languages: ['العربية', 'English'],
    soft: ['التواصل', 'العمل الجماعي', 'حل المشكلات', 'القيادة'],
  },
  الهندسة: {
    tech: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Revit', 'Primavera', 'ANSYS', 'ETABS', 'STAAD Pro', 'SAP2000', 'CATIA'],
    languages: ['العربية', 'English'],
    soft: ['التفكير التحليلي', 'إدارة المشاريع', 'الابتكار', 'العمل تحت الضغط'],
  },
  'الصحة والطب': {
    tech: ['EMR', 'PACS', 'ICD Coding', 'DICOM', 'Ventilator', 'Ultrasound', 'X-Ray', 'MRI', 'EHR Systems', 'Lab Information System'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'التواصل', 'العمل الجماعي', 'الانتباه للتفاصيل'],
  },
  التعليم: {
    tech: ['Google Classroom', 'Moodle', 'Zoom', 'Smart Board', 'Microsoft Teams', 'Canva', 'PowerPoint', 'Kahoot'],
    languages: ['العربية', 'English'],
    soft: ['التواصل', 'إدارة الصف', 'الإبداع', 'الصبر'],
  },
  'المحاسبة والمالية': {
    tech: ['Microsoft Excel', 'QuickBooks', 'SAP', 'Oracle ERP', 'Power BI', 'Tableau', 'IFRS', 'TaxSoft'],
    languages: ['العربية', 'English'],
    soft: ['التحليل', 'الانتباه للتفاصيل', 'التفاوض', 'التواصل'],
  },
  'التسويق والمبيعات': {
    tech: ['Salesforce', 'HubSpot', 'Mailchimp', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEMrush', 'Canva', 'Photoshop'],
    languages: ['العربية', 'English'],
    soft: ['الإقناع', 'التفاوض', 'التواصل', 'الإبداع'],
  },
  الإدارة: {
    tech: ['Microsoft Word', 'Microsoft Excel', 'PowerPoint', 'Google Workspace', 'Asana', 'Trello', 'Slack', 'SAP SuccessFactors'],
    languages: ['العربية', 'English'],
    soft: ['إدارة الوقت', 'التنظيم', 'القيادة', 'التواصل'],
  },
  القانون: {
    tech: ['LexisNexis', 'Westlaw', 'Contract Drafting Tools', 'Compliance Software', 'Microsoft Word', 'Excel'],
    languages: ['العربية', 'English'],
    soft: ['التفاوض', 'التحليل', 'التواصل', 'السرية'],
  },
  العقارات: {
    tech: ['CRM Systems', 'Property Management Software', 'Real Estate Math', 'MLS', 'Microsoft Excel'],
    languages: ['العربية', 'English'],
    soft: ['التفاوض', 'التواصل', 'الإقناع', 'بناء العلاقات'],
  },
  'خدمة العملاء': {
    tech: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud', 'Talkdesk', 'Microsoft Office'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'حل المشكلات', 'التواصل', 'إدارة الوقت'],
  },
  'العلوم والبحث العلمي': {
    tech: ['SPSS', 'R', 'Python', 'Laboratory Equipment', 'Data Analysis', 'Grant Writing'],
    languages: ['العربية', 'English'],
    soft: ['التفكير النقدي', 'الانتباه للتفاصيل', 'كتابة التقارير', 'التحليل'],
  },
  'الأمن والحراسة': {
    tech: ['CCTV Monitoring', 'Fire Safety Systems', 'Access Control', 'Reporting Tools', 'First Aid'],
    languages: ['العربية'],
    soft: ['الانتباه', 'اتخاذ القرار', 'التواصل', 'اللياقة البدنية'],
  },
  // مجموعة افتراضية فارغة لمنع تكرار المهارات العامة
  أخرى: {
    tech: [],
    languages: [],
    soft: [],
  },
};

// مهارات حسب التخصص الدقيق (تتجاوز الفئة عند توفرها)
export const SPECIALTY_SKILLS: Record<string, SkillGroups> = {
  // تقنية المعلومات
  'مطور واجهات': {
    tech: ['React', 'Vue.js', 'Next.js', 'Tailwind CSS', 'SASS', 'Redux', 'Web Performance', 'Testing Library'],
    languages: ['العربية', 'English'],
    soft: ['حل المشكلات', 'الإبداع', 'التواصل'],
  },
  'مطور باك-إند': {
    tech: ['Node.js', 'Express', 'NestJS', 'PostgreSQL', 'Redis', 'Docker', 'Microservices', 'GraphQL', 'Prisma'],
    languages: ['العربية', 'English'],
    soft: ['المنطق', 'حل المشكلات', 'التفكير التحليلي'],
  },
  'مطور تطبيقات موبايل': {
    tech: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store Connect', 'Play Console'],
    languages: ['العربية', 'English'],
    soft: ['الانتباه للتفاصيل', 'تجربة المستخدم'],
  },
  // هندسة
  'مهندس ميكانيكا': {
    tech: ['Thermodynamics', 'Fluid Mechanics', 'HVAC', 'Piping Design', 'Heat Transfer', 'Manufacturing Processes'],
    languages: ['العربية', 'English'],
    soft: ['حل المشكلات', 'العمل الجماعي'],
  },
  'مهندس مدني': {
    tech: ['Site Supervision', 'Structural Analysis', 'Concrete Design', 'Steel Design', 'Quantity Surveying', 'LPS'],
    languages: ['العربية', 'English'],
    soft: ['القيادة', 'إدارة الوقت'],
  },
  // طب
  'طبيب أسنان': {
    tech: ['Orthodontics', 'Endodontics', 'Dental Surgery', 'Periodontics', 'Dental Implants', 'CAD/CAM Dentistry'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'الدقة', 'التواصل'],
  },
  'أخصائي أشعة': {
    tech: ['MRI', 'CT Scan', 'Ultrasound', 'X-Ray Interpretation', 'Radiation Safety', 'Picture Archiving (PACS)'],
    languages: ['العربية', 'English'],
    soft: ['الانتباه للتفاصيل', 'الهدوء'],
  },
  // محاسبة
  محاسب: {
    tech: ['Financial Reporting', 'General Ledger', 'Accounts Payable', 'Bank Reconciliation', 'Tax Filing', 'ERP Systems'],
    languages: ['العربية', 'English'],
    soft: ['الدقة', 'الأمانة'],
  },
  // تسويق
  'أخصائي تسويق رقمي': {
    tech: ['Google Ads', 'SEO', 'SEM', 'Content Strategy', 'Social Media Analytics', 'Email Marketing', 'PPC'],
    languages: ['العربية', 'English'],
    soft: ['الإبداع', 'التحليل'],
  },
  // قانون
  'محام شركات': {
    tech: ['Corporate Governance', 'Legal Auditing', 'Mergers & Acquisitions', 'Compliance', 'Contract Management'],
    languages: ['العربية', 'English'],
    soft: ['التفاوض', 'التفكير النقدي'],
  },
  'مهندس برمجيات': {
    tech: ['System Design', 'Algorithms', 'Data Structures', 'Cloud Computing', 'Git', 'Agile/Scrum', 'CI/CD'],
    languages: ['العربية', 'English'],
    soft: ['حل المشكلات', 'التعلم المستمر'],
  },
  'مطور Full-Stack': {
    tech: ['JavaScript/TS', 'React/Next.js', 'Node.js', 'SQL/NoSQL', 'API Design', 'DevOps Basic', 'Tailwind CSS'],
    languages: ['العربية', 'English'],
    soft: ['تعدد المهام', 'حل المشكلات'],
  },
  'مهندس ذكاء اصطناعي': {
    tech: ['Python', 'PyTorch/TensorFlow', 'LLMs', 'NLP', 'Computer Vision', 'Data Scraping', 'Prompt Engineering'],
    languages: ['العربية', 'English'],
    soft: ['التحليل', 'الابتكار'],
  },
  'أخصائي Odoo': {
    tech: ['Python', 'XML', 'Odoo Framework', 'PostgreSQL', 'QWeb', 'JavaScript', 'Odoo Studio', 'API Integration'],
    languages: ['العربية', 'English'],
    soft: ['التحليل', 'حل المشكلات'],
  },
  'أخصائي Zoho': {
    tech: ['Deluge Scripting', 'Zoho CRM', 'Zoho Creator', 'Zoho Books', 'Zoho Analytics', 'Zoho Flow', 'ZIA'],
    languages: ['العربية', 'English'],
    soft: ['التواصل', 'حل المشكلات'],
  },
  'أخصائي Microsoft Dynamics': {
    tech: ['Dynamics 365', 'Power Apps', 'Power Automate', 'C#', '.NET', 'SQL Server', 'Azure', 'X++'],
    languages: ['العربية', 'English'],
    soft: ['التفكير التحليلي', 'التواصل'],
  },
  'محلل نظم SAP': {
    tech: ['SAP ERP', 'ABAP', 'SAP HANA', 'SAP Fiori', 'SAP S/4HANA', 'Business Objects', 'SAP MM/FI/SD'],
    languages: ['العربية', 'English'],
    soft: ['التفكير الاستراتيجي', 'التحليل'],
  },
  'استشاري ERP': {
    tech: ['Business Process Mapping', 'ERP Implementation', 'Data Migration', 'System Testing', 'Supply Chain Management'],
    languages: ['العربية', 'English'],
    soft: ['القيادة', 'إدارة التغيير'],
  },
  'طبيب عام': {
    tech: ['Primary Care', 'Patient Diagnosis', 'Electronic Health Records (EHR)', 'Medical Scripting', 'Preventive Medicine'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'التواصل'],
  },
  'طبيب جراحة': {
    tech: ['Surgical Procedures', 'Pre-operative Care', 'Post-operative Care', 'Laparoscopy', 'Trauma Care'],
    languages: ['العربية', 'English'],
    soft: ['الدقة', 'العمل الجماعي'],
  },
  'أخصائي مختبر': {
    tech: ['Clinical Chemistry', 'Hematology', 'Microbiology', 'Lab Equipment Maintenance', 'Quality Control'],
    languages: ['العربية', 'English'],
    soft: ['الدقة', 'الانتباه للتفاصيل'],
  },
  'معلم ثانوي': {
    tech: ['Classroom Management', 'Curriculum Design', 'Educational Software', 'Student Assessment', 'LMS'],
    languages: ['العربية', 'English'],
    soft: ['التواصل', 'الصبر'],
  },
  'مدقق مالي': {
    tech: ['Internal Audit', 'Risk Assessment', 'Compliance', 'Financial Statements', 'Data Auditing Tools'],
    languages: ['العربية', 'English'],
    soft: ['النزاهة', 'التحليل'],
  },
  'صحفي': {
    tech: ['News Writing', 'Investigative Reporting', 'Digital Media', 'Video Interviewing', 'Fact Checking'],
    languages: ['العربية', 'English'],
    soft: ['التواصل', 'الجرأة'],
  },
  'مصمم جرافيك': {
    tech: ['Adobe Photoshop', 'Adobe Illustrator', 'InDesign', 'Branding', 'Typography', 'Print Design'],
    languages: ['العربية', 'English'],
    soft: ['الإبداع', 'الانتباه للتفاصيل'],
  },
  'مصمم تجربة مستخدم': {
    tech: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Accessibility'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'التفكير التحليلي'],
  },
  'وكيل عقارات': {
    tech: ['Property Listing', 'Market Analysis', 'Salesforce CRM', 'Digital Marketing', 'Closing Techniques'],
    languages: ['العربية', 'English'],
    soft: ['التفاوض', 'الإقناع'],
  },
  'ممثل خدمة عملاء': {
    tech: ['CRM Software', 'Ticketing Systems', 'Phone Etiquette', 'Live Chat Support', 'Conflict Resolution'],
    languages: ['العربية', 'English'],
    soft: ['التعاطف', 'الصبر'],
  },
  'باحث علمي': {
    tech: ['Research Methodology', 'Scientific Writing', 'Statistical Analysis', 'Grant Proposals', 'Lab Techniques'],
    languages: ['العربية', 'English'],
    soft: ['التفكير النقدي', 'المثابرة'],
  },
  'حارس أمن': {
    tech: ['CCTV Monitoring', 'Access Control Systems', 'Emergency Response', 'Reporting', 'First Aid'],
    languages: ['العربية'],
    soft: ['اليقظة', 'الانضباط'],
  },
  'عالم بيانات': {
    tech: ['Python/R', 'Machine Learning', 'Data Visualization', 'Big Data', 'SQL', 'Deep Learning'],
    languages: ['العربية', 'English'],
    soft: ['التحليل', 'حل المشكلات'],
  },
  'مهندس شبكات': {
    tech: [
      'CCNA',
      'CCNP',
      'OSPF',
      'BGP',
      'Cisco IOS',
      'Switching',
      'Routing',
      'Firewall',
      'Wireshark',
      'MikroTik',
      'Windows Server',
      'Active Directory',
      'Network Security',
      'Fortinet',
      'Juniper',
      'VPN',
      'VoIP',
    ],
    languages: ['العربية', 'English'],
    soft: ['حل المشكلات', 'العمل تحت الضغط', 'التواصل'],
  },
};
