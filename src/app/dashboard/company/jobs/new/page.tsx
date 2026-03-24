"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import JobForm, { JobPayload } from "@/components/JobForm";
import { useLanguage } from "@/context/LanguageContext";

export default function NewJobPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (payload: JobPayload) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/company/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/dashboard/company/jobs");
    } catch (e: any) {
      setError(e.message || t('job_form.create_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t('job_form.add_new_job')}</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <JobForm submitting={submitting} onSubmit={onSubmit} />
    </div>
  );
}