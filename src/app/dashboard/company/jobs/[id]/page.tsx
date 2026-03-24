"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description?: string;
  location: string;
  type: string;
  createdAt: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/company/jobs/${id}`);
        if (!res.ok) throw new Error("فشل جلب الوظيفة");
        const data = await res.json();
        setJob(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-4">جاري التحميل...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!job) return <p className="p-4">لم يتم العثور على الوظيفة</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p className="mb-2 text-gray-700">الموقع: {job.location}</p>
      <p className="mb-2 text-gray-700">النوع: {job.type}</p>
      <p className="mb-4 text-gray-700">تاريخ النشر: {new Date(job.createdAt).toLocaleDateString('ar-EG')}</p>
      {job.description && <p className="whitespace-pre-line">{job.description}</p>}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push(`/dashboard/company/jobs/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          تعديل
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          رجوع
        </button>
      </div>
    </div>
  );
}
