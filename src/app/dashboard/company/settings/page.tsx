"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-20 bg-gray-200 rounded" />
});

// Initialize Quill modules
const modules = {
  toolbar: {
    container: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': 1 }, { 'header': 2 }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image']
    ],
    handlers: {
      image: () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
              const reader = new FileReader();
              reader.onloadend = () => {
                const range = window.getSelection()?.getRangeAt(0);
                range?.deleteContents();
                const img = document.createElement('img');
                img.src = reader.result as string;
                img.style.maxWidth = '100%';
                range?.insertNode(img);
              };
              reader.readAsDataURL(file);
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        };
      }
    }
  }
};

// Initialize Quill formats
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'align', 'color', 'background',
  'script', 'direction'
];

import { INDUSTRY_SPECIALTIES } from "@/constants/industrySpecialties";

import { industries } from "@/constants/industrySpecialties";
import { COUNTRIES, PROVINCES, REGIONS, Country } from "@/constants/locations";

interface RichItem { image: string; descriptionHtml: string; }

interface CompanyProfile {
  specialty: string | null;
  name: string;
  image: string | null;
  phone: string;
  industry: string;
  description: string | null;
  clients: string | null;
  products: string | null;
  email: string;
  password: string;
  role: string;
  emailVerified: boolean;
  commercialNumber: string;
  companySize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  contactPerson: string;
  foundedYear: number | null;
  website: string | null;
  websiteUrl: string | null;
  country: string;
  province: string;
  region: string;
}

export default function CompanySettingsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as { accessToken: string } | undefined;
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [quillLoaded, setQuillLoaded] = useState(false);

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await encodeFileToBase64(file);
      setProfile(prev => prev ? ({
        ...prev,
        image: base64
      }) : null);
    } catch (err) {
      console.error('Error encoding image:', err);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // قائمة السنوات من 1900 إلى العام الحالي
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  // قائمة التخصصات بناءً على المجال المختار
  const specialties = profile?.industry ? INDUSTRY_SPECIALTIES[profile.industry] ?? [] : [];
  const provinces = profile?.country ? PROVINCES[profile.country as Country] ?? [] : [];
  const regions = profile?.province ? REGIONS[profile.province] ?? [] : [];

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/company/profile`, {
        headers: {
          "Authorization": `Bearer ${user?.accessToken}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
            // Initialize empty profile if not found or error
            setProfile({
              specialty: null,
              name: '',
              image: null,
              phone: '',
              industry: '',
              description: '',
              clients: '',
              products: '',
              email: '',
              password: '',
              role: 'COMPANY',
              emailVerified: false,
              commercialNumber: '',
              companySize: 'SMALL',
              contactPerson: '',
              foundedYear: null,
              website: '',
              websiteUrl: '',
              country: '',
              province: '',
              region: ''
            });
          } else {
            setProfile(data);
          }
          setLoading(false);
          setInitialLoad(false);
          setQuillLoaded(true);
        })
        .catch((err) => {
          console.error("Error fetching company profile:", err);
          setError("حدث خطأ أثناء تحميل بيانات الشركة");
          setLoading(false);
          setInitialLoad(false);
          setQuillLoaded(true);
        });
    } else if (status === "unauthenticated") {
      setInitialLoad(false);
    }
  }, [status, router, user?.accessToken]);

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clean the value if it's empty
    const cleanValue = value.trim();

    setProfile(prev => {
      if (!prev) return prev;
      let updated: any = { ...prev, [name]: cleanValue };

      // إذا قام المستخدم بتغيير البلد، قم بتصفية المحافظة والمنطقة
      if (name === 'country') {
        updated.province = '';
        updated.region = '';
      }
      // إذا قام المستخدم بتغيير المحافظة، قم بتصفية المنطقة
      if (name === 'province') {
        updated.region = '';
      }
      return updated;
    });
  };

  // Handle rich text editor changes
  const handleRichTextChange = (value: string, field: 'description' | 'clients') => {
    setProfile(prev => prev ? ({
      ...prev,
      [field]: value.trim() || ''
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // التحقق من وجود اتصال بالإنترنت
      if (!navigator.onLine) {
        throw new Error("لا يوجد اتصال بالإنترنت");
      }

      const updateData = {
        specialty: profile.specialty || '',
        name: profile.name || '',
        image: profile.image || null,
        phone: profile.phone || '',
        industry: profile.industry || '',
        description: profile.description || '',
        clients: profile.clients || '',
        products: profile.products || '',
        email: profile.email || '',
        password: '',
        role: 'COMPANY',
        emailVerified: true,
        commercialNumber: profile.commercialNumber || '',
        companySize: profile.companySize || 'SMALL',
        contactPerson: profile.contactPerson || '',
        foundedYear: profile.foundedYear || null,
        website: profile.website || '',
        websiteUrl: profile.websiteUrl || '',
        country: profile.country || '',
        province: profile.province || '',
        region: profile.region || ''
      };

      // Remove Content-Length header as it is unsafe to set manually
      const body = JSON.stringify(updateData);
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.accessToken}`,
      };

      // إضافة مؤقت للتأكد من إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 500));

      const res = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: headers,
        body: body,
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `حدث خطأ (HTTP ${res.status}): ${res.statusText}`);
      }

      const data = await res.json();

      // تحديث البيانات المحلية بعد النجاح
      setProfile(prev => ({
        ...prev,
        ...updateData
      }));

      setSuccess("تم تحديث الملف الشخصي بنجاح");
      // Auto-hide success message after 3 seconds
      setTimeout(() => { setSuccess("") }, 3000);

    } catch (err: any) {
      console.error("حدث خطأ أثناء الحفظ:", err);
      setError(`حدث خطأ: ${err.message || "فشل في حفظ التغييرات"}`);
    } finally {
      setSaving(false);
    }
  };


  if (initialLoad || !profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <style jsx global>{`
        input, textarea, select, span, label, li, p, div {
          color: #000000 !important;
        }
        .ql-editor {
          color: #000000 !important;
          background-color: #ffffff !important;
          min-height: 150px;
        }
        .ql-container.ql-snow {
          background-color: #ffffff !important;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .ql-toolbar.ql-snow {
          background-color: #f3f4f6 !important;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .ql-snow .ql-stroke {
          stroke: #374151 !important;
        }
        .ql-snow .ql-fill {
          fill: #374151 !important;
        }
        .ql-snow .ql-picker {
          color: #374151 !important;
        }
        input::placeholder, textarea::placeholder {
          color: #9CA3AF !important;
        }
        select option {
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        select option:hover,
        select option:focus,
        select option:checked {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-4">إعدادات الشركة</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold ml-2">خطأ!</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold ml-2">نجاح!</strong>
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            {/* زر الحفظ في الأعلى */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
            {/* Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شعار الشركة</label>
                {profile.image && (
                  <img
                    src={profile.image}
                    alt="Logo preview"
                    className="w-24 h-24 object-contain mb-2 border rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم الشركة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مجال العمل</label>
                <select
                  name="industry"
                  value={profile.industry || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر مجال العمل</option>
                  {industries.map((industry: string) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                <select
                  name="specialty"
                  value={profile.specialty || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر التخصص</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم السجل التجاري</label>
                <input
                  type="text"
                  name="commercialNumber"
                  value={profile.commercialNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رقم السجل التجاري"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حجم الشركة</label>
                <select
                  name="companySize"
                  value={profile.companySize || 'SMALL'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SMALL">صغيرة</option>
                  <option value="MEDIUM">متوسطة</option>
                  <option value="LARGE">كبيرة</option>
                  <option value="ENTERPRISE">مؤسسة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشخص المعني</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={profile.contactPerson || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم الشخص المعني"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">سنة التأسيس</label>
                <select
                  name="foundedYear"
                  value={profile.foundedYear || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر سنة التأسيس</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = 2025 - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع الإلكتروني</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={profile.websiteUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رابط موقعك الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الموقع على خرائط جوجل</label>
                <input
                  type="url"
                  name="website"
                  value={profile.website || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رابط الموقع على خرائط جوجل"
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البلد</label>
                <select
                  name="country"
                  value={profile.country || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر البلد</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة / المنطقة</label>
                <select
                  name="province"
                  value={profile.province || ''}
                  onChange={handleChange}
                  disabled={!profile.country}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">اختر المحافظة</option>
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة / الحي</label>
                <select
                  name="region"
                  value={profile.region || ''}
                  onChange={handleChange}
                  disabled={!profile.province}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">اختر المدينة</option>
                  {regions.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نبذة عن الشركة</label>
              {quillLoaded ? (
                <ReactQuill
                  theme="snow"
                  value={profile.description || ''}
                  onChange={(value) => handleRichTextChange(value, 'description')}
                  modules={modules}
                  formats={formats}
                  style={{
                    height: '200px',
                    border: 'none'
                  }}
                  placeholder="اكتب نبذة عن شركتك هنا..."
                />
              ) : (
                <div className="animate-pulse h-20 bg-gray-200 rounded" />
              )}
            </div>

            {/* Company Clients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عملاء الشركة</label>
              {quillLoaded ? (
                <ReactQuill
                  theme="snow"
                  value={profile.clients || ''}
                  onChange={(value) => handleRichTextChange(value, 'clients')}
                  modules={modules}
                  formats={formats}
                  style={{
                    height: '200px',
                    border: 'none'
                  }}
                  placeholder="اكتب عن عملاء شركتك هنا..."
                />
              ) : (
                <div className="animate-pulse h-20 bg-gray-200 rounded" />
              )}
            </div>


          </form>
        </div>
      </div>
    </div>
  )
}
