import { useEffect, useState } from "react";
import { MatchStatus } from "@prisma/client";

interface Match {
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  resume: any;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
}

export default function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const response = await fetch("/api/company/matches");
      const data = await response.json();
      setMatches(data.matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }

  async function updateMatchStatus(matchId: string, status: MatchStatus) {
    try {
      const response = await fetch("/api/company/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: matchId, status }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchMatches();
      }
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">المطابقات</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.jobId} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {match.candidateName}
                </h3>
                <p className="text-gray-600 mb-2">{match.jobTitle}</p>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm">التخصص: {match.resume?.category}</p>
                  <p className="text-sm">الخبرة: {match.resume?.experience}</p>
                  <p className="text-sm">المستوى الوظيفي: {match.resume?.jobLevel}</p>
                </div>
              </div>
              <div className="ml-4">
                <select
                  value={match.status}
                  onChange={(e) => updateMatchStatus(match.jobId, e.target.value as MatchStatus)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="ACCEPTED">تم القبول</option>
                  <option value="REJECTED">تم الرفض</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>
                تم إنشاء المطابقة: {new Date(match.createdAt).toString()}
              </span>
              <span>
                آخر تحديث: {new Date(match.updatedAt).toString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
