import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
export default function CaregiverDashboard() {
  const [patients, setPatients] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAll = async () => {
      const snap = await getDocs(collection(db, "patients"));
      const patientList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPatients(patientList);
      const today = new Date().toISOString().split("T")[0];
      const logMap = {};
      for (const p of patientList) {
        const logRef = doc(db, "patients", p.id, "logs", today);
        const logSnap = await getDoc(logRef);
        logMap[p.id] = logSnap.exists() ? logSnap.data() : null;
      }
      setLogs(logMap);
      setLoading(false);
    };
    fetchAll();
  }, []);
  const getSeverity = (symptoms) => {
    if (!symptoms) return "none";
    const avg = Object.values(symptoms).reduce((a, b) => a + b, 0) / Object.values(symptoms).length;
    if (avg >= 4) return "high";
    if (avg >= 3) return "medium";
    return "low";
  };
  const severityColors = { high: "border-red-400 bg-red-50", medium: "border-yellow-400 bg-yellow-50", low: "border-green-400 bg-green-50", none: "border-gray-200 bg-white" };
  const severityBadge = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700", none: "bg-gray-100 text-gray-500" };
  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-700 font-semibold text-lg">Loading patient data...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">👨👩👧 Caregiver Dashboard</h2>
        <p className="text-gray-500 mb-8">Real-time overview of all patients for {new Date().toDateString()}</p>
        {patients.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-gray-400">No patients registered yet.</div>}
        <div className="space-y-6">
          {patients.map(p => {
            const log = logs[p.id];
            const severity = getSeverity(log?.symptoms);
            const completedCount = log?.completed ? Object.values(log.completed).filter(Boolean).length : 0;
            return (
              <div key={p.id} className={`rounded-3xl border-2 p-6 shadow-md ${severityColors[severity]}`}>
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.email}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full font-semibold ${severityBadge[severity]}`}>
                    {severity === "none" ? "No log today" : severity === "high" ? "⚠️ High Severity" : severity === "medium" ? "⚡ Moderate" : "✅ Doing Well"}
                  </span>
                </div>
                {log ? (
                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(log.symptoms || {}).map(([key, val]) => (
                      <div key={key} className="bg-white rounded-2xl p-3 text-center shadow-sm">
                        <p className="text-xs text-gray-500 capitalize mb-1">{key}</p>
                        <p className="text-2xl font-bold text-indigo-700">{val}<span className="text-sm text-gray-400">/5</span></p>
                      </div>
                    ))}
                  </div>
                ) : <p className="mt-4 text-gray-400 text-sm">Patient hasn't logged today yet.</p>}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Exercises:</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full font-semibold ${completedCount >= 4 ? "bg-green-100 text-green-700" : completedCount >= 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>{completedCount}/5 completed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
