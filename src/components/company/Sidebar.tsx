"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiHome, FiBriefcase, FiSettings, FiLogOut } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SidebarProps {
  logoUrl?: string | null;
  companyName?: string | null;
}

export default function Sidebar({ logoUrl, companyName }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const menuItems = [
    { icon: FiHome, label: t('company.main_page'), href: '/dashboard/company' },
    { icon: FiBriefcase, label: t('company.manage_jobs'), href: '/dashboard/company/jobs' },
    { icon: FiSettings, label: t('company.company_settings'), href: '/dashboard/company/settings' },
  ];

  return (
    <aside className="h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sticky top-0">
      <div className="p-8 flex flex-col h-full">
        {/* Logo and Company Name - Premium Design */}
        <Link href="/dashboard/company" className="flex flex-col items-center mb-10 group" dir="ltr">
          {logoUrl ? (
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 mb-4 transform group-hover:scale-105 transition-transform duration-300">
              <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mb-4 text-white text-4xl font-black shadow-xl shadow-blue-500/30 transform group-hover:scale-105 transition-transform duration-300">
              {companyName?.charAt(0) ?? "C"}
            </div>
          )}
          <h2 className="text-xl font-black text-slate-900 text-center tracking-tight group-hover:text-blue-600 transition-colors">
            {companyName ?? t('dashboard.company_name')}
          </h2>
          <div className="flex items-center gap-1.5 mt-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('chatbot.online')}</span>
          </div>
        </Link>

        {/* Language Switcher - Refined */}
        <div className="mb-10 px-4">
          <div className="bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Navigation - Premium Items */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 relative group overflow-hidden ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {item.label}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Discrete but Modern */}
        <div className="pt-8 border-t border-slate-100 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50/50 font-bold text-sm transition-all duration-300 group"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            {t('dashboard.logout')}
          </button>
        </div>
      </div>
    </aside>
  );
}
