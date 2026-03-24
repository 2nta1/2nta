"use client";

import { useState } from "react";
import { FiImage, FiSend, FiZap, FiCheck, FiType, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface PostGeneratorProps {
  onPostCreated?: () => void;
  companyName?: string;
}

type PostType = 'HIRING' | 'MILESTONE' | 'NEWS' | 'TIPS';

export default function PostGenerator({ onPostCreated, companyName = "شركتنا" }: PostGeneratorProps) {
  const { t, locale } = useLanguage();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>('HIRING');
  const [details, setDetails] = useState("");

  const templates = {
    HIRING: {
      ar: (d: string) => `🎯 نحن نوظف! \n\nتعلن ${companyName} عن فتح باب التقديم لوظيفة ${d || '[اسم الوظيفة]'} المذهلة. \n\nانضم إلى فريقنا المبدع وساهم في بناء المستقبل معنا. \n\n🚀 قدم الآن عبر منصة 2NTA! \n#وظائف #توظيف #فرصة_عمل`,
      en: (d: string) => `🎯 We are Hiring! \n\n${companyName} is looking for a talented ${d || '[Job Title]'} to join our amazing team. \n\nGrow with us and be part of our success story. \n\n🚀 Apply now via 2NTA platform! \n#Jobs #Hiring #CareerOpportunity`
    },
    MILESTONE: {
      ar: (d: string) => `🎉 فخورون بمشاركتكم هذا الإنجاز! \n\nلقد نجحت ${companyName} في ${d || '[الإنجاز المتدفق]'} بفضل جهود فريقنا الرائع ودعمكم المستمر. \n\nنحو مزيد من النجاحات! 🚀✨ \n#إنجاز #نجاح #شركتنا`,
      en: (d: string) => `🎉 Proud to share this milestone! \n\n${companyName} has successfully ${d || '[the milestone]'} thanks to our incredible team and your constant support. \n\nTo more successes! 🚀✨ \n#Milestone #Success #CompanyNews`
    },
    NEWS: {
      ar: (d: string) => `📢 خبر سار من ${companyName}! \n\nيسعدنا الإعلان عن ${d || '[الخبر الجديد]'}. نحن متحمسون جداً لهذه الخطوة وتأثيرها الإيجابي. \n\nابقوا متابعين للمزيد! 💎 \n#أخبار_الشركة #تحديث #2NTA`,
      en: (d: string) => `📢 Great news from ${companyName}! \n\nWe are excited to announce ${d || '[the news]'}. We are very enthusiastic about this step and its positive impact. \n\nStay tuned for more! 💎 \n#CompanyNews #Update #Innovation`
    },
    TIPS: {
      ar: (d: string) => `💡 نصيحة مهنية من ${companyName}: \n\nبخصوص ${d || '[الموضوع]'}، ننصح دائماً بالاهتمام بالتطوير المستمر والبحث عن حلول مبتكرة. \n\nمستقبلك يبدأ من اليوم! ✨ \n#نصيحة #تطوير_ذاتي #بيئة_عمل`,
      en: (d: string) => `💡 Professional tip from ${companyName}: \n\nRegarding ${d || '[the topic]'}, we always recommend continuous development and seeking innovative solutions. \n\nYour future starts today! ✨ \n#Tips #SelfDevelopment #WorkPlace`
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation feel
    setTimeout(() => {
      const generated = templates[selectedType][locale as 'ar' | 'en'](details);
      setContent(generated);
      setIsGenerating(false);
    }, 1200);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);
    try {
      let base64Image: string | undefined;
      if (images[0]) {
        base64Image = await encodeFileToBase64(images[0]);
      }
      const res = await fetch('/api/company/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: selectedType, image: base64Image }),
      });
      if (res.ok) {
        setContent("");
        setImages([]);
        setDetails("");
        onPostCreated?.();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const types = [
    { id: 'HIRING', label: t('post_generator.type_hiring'), color: 'from-blue-500 to-indigo-600' },
    { id: 'MILESTONE', label: t('post_generator.type_milestone'), color: 'from-purple-500 to-pink-600' },
    { id: 'NEWS', label: t('post_generator.type_news'), color: 'from-orange-500 to-amber-600' },
    { id: 'TIPS', label: t('post_generator.type_tips'), color: 'from-green-500 to-teal-600' },
  ];

  return (
    <div className="glass-card rounded-[2.5rem] p-8 mb-10 border-white/60 premium-shadow">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <FiZap className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">{t('post_generator.title')}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as PostType)}
            className={`p-4 rounded-2xl border transition-all duration-300 text-sm font-bold flex flex-col items-center gap-2 ${
              selectedType === type.id 
                ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-[1.05]` 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder={t('post_generator.placeholder')}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="absolute left-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <FiZap className="w-4 h-4" />
              </motion.div>
            ) : <FiZap className="w-4 h-4" />}
            {isGenerating ? t('post_generator.generating') : t('post_generator.generate')}
          </button>
        </div>

        <AnimatePresence>
          {content && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <textarea
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all min-h-[180px] text-lg"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="absolute top-4 right-4 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-green-100">
                <FiCheck className="w-3 h-3" /> {t('post_generator.success')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors text-sm font-black uppercase tracking-widest">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-all">
            <FiImage className="w-5 h-5" />
          </div>
          {images.length > 0 ? `${images.length} ${locale === 'ar' ? 'صور' : 'images'}` : t('post_composer.add_images')}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="px-10 py-4 btn-gradient rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
        >
          {t('post_generator.post')}
          <FiArrowRight className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
