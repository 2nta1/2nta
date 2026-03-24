"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JobForm, { JobPayload, RatedSkill } from "@/components/JobForm";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();

  const [initial, setInitial] = useState<Partial<JobPayload> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/company/jobs/${id}`);
        if (!res.ok) throw new Error("فشل جلب الوظيفة");
        const data = await res.json();

        const loc = (data.location ?? "").split(" - ");
        const toRated = (arr: any[] = []): RatedSkill[] =>
          arr.map((n) => (typeof n === "string" ? { name: n, level: 50 } : n));

        const mapType=(t?:string)=>{
          switch(t){
            case 'FULL_TIME':return 'دوام كامل';
            case 'PART_TIME':return 'دوام جزئي';
            case 'REMOTE':return 'عمل عن بعد';
            case 'CONTRACT':return 'عمل مؤقت';
            case 'FLEXIBLE':return 'عمل مرن';
            default:return t||'';
          }
        };
        const categoryGuess = data.category || data.field || '';
        const specialtyGuess = data.specialty || data.title || '';

        setInitial({
          category: categoryGuess,
          specialty: specialtyGuess,

          jobType: mapType(data.type),
          country: loc[0] ?? "",
          province: loc[1] ?? "",
          region: loc[2] ?? "",
          salary: String(data.salary ?? ""),
          yearsExp: data.yearsExp || data.experience || "",
          techSkills: toRated(data.techSkills || data.skills || data.requirements),
          softSkills: toRated(data.softSkills || data.softskills || []),
          languages: toRated(data.languages || data.langs || []),
        });
      } catch (e: any) {
        setError(e.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ---------- submit ---------- */
  const onSubmit = async (payload: JobPayload) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/company/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/dashboard/company/jobs");
    } catch (e: any) {
      setError(e.message || "فشل التحديث");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- render ---------- */
  if (loading) return <p className="p-4">جاري التحميل…</p>;
  if (error && !initial) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">تعديل الوظيفة</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {initial && <JobForm initial={initial} submitting={submitting} onSubmit={onSubmit} />}
    </div>
  );
}