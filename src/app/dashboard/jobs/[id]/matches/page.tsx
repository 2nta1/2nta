"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function JobMatchesPage() {
  const { id: jobId } = useParams() as { id: string };

  const { data, isLoading, error, mutate } = useSWR(
    jobId ? `/api/company/matches?jobId=${jobId}` : null,
    fetcher
  );

  const updateStatus = async (userId: string, status: "ACCEPTED" | "REJECTED") => {
    // optimistic update
    mutate(
      (prev: any) => {
        if (!prev) return prev;
        const updated = prev.matches.filter((m: any) => {
          if (m.candidateId !== userId) return true;
          if (status === "ACCEPTED") {
            m.status = "ACCEPTED";
            return true;
          }
          // status REJECTED: remove from list
          return false;
        });
        return { ...prev, matches: updated };
      },
      false
    );

    try {
      const res = await fetch("/api/company/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, userId, status }),
      });
      if (!res.ok) throw new Error("فشل تحديث الحالة");

      if (status === "ACCEPTED") {
        toast.success("تم قبول المرشح بنجاح! يمكنك الآن التواصل معه.");
      } else if (status === "REJECTED") {
        toast.error("تم استبعاد المرشح.");
      }

      mutate();
    } catch (err: any) {
      console.error("Match update error:", err);
      toast.error(err.message || "حدث خطأ أثناء التحديث");
      mutate(); // rollback optimistic update
    }
  };

  if (isLoading) return <p className="p-4">جاري التحميل...</p>;
  if (error) return <p className="p-4 text-red-500">خطأ في جلب البيانات</p>;

  const matches = data?.matches || [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">المتقدمون المطابقون</h1>
      {matches.length === 0 && <p>لا يوجد مطابقون حتى الآن.</p>}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">المتقدم</th>
            <th className="p-2 border">نسبة التطابق</th>
            <th className="p-2 border">الحالة</th>
            <th className="p-2 border">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m: any) => (
            <tr key={m.candidateId} className="border-t">
              <td className="p-2 border-r">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {m.candidateName.charAt(0)}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/candidates/${m.candidateId}`}
                      className="font-bold text-gray-900 hover:text-blue-600 hover:underline transition"
                    >
                      {m.candidateName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      النتيجة: {m.score}%
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-2 border-r text-center">{m.score || "-"}%</td>
              <td className="p-2 border-r text-center">{m.status}</td>
              <td className="p-2 flex gap-2 justify-center">
                {m.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(m.candidateId, "ACCEPTED")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      مطابق
                    </button>
                    <button
                      onClick={() => updateStatus(m.candidateId, "REJECTED")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      غير مطابق
                    </button>
                  </>
                )}
                {m.status === "ACCEPTED" && (
                  <>
                    {m.chatId ? (
                      <Link href={`/dashboard/messages/${m.chatId}`} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">دردشة</Link>
                    ) : (
                      <span className="text-gray-400 text-xs italic">بانتظار تفعيل الدردشة</span>
                    )}
                    <Link href={`/dashboard/candidates/${m.candidateId}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs">الملف الشخصي</Link>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
