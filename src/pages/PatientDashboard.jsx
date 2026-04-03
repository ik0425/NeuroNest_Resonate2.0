import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const exercises = [
  { id: 1, name: "Finger Tapping", desc: "Tap each finger to your thumb 10 times each hand", icon: "👆" },
  { id: 2, name: "Wrist Rotation", desc: "Rotate wrists clockwise and counter-clockwise 15 times", icon: "🔄" },
  { id: 3, name: "Hand Squeeze", desc: "Squeeze a soft ball or rolled towel 20 times each hand", icon: "✊" },
  { id: 4, name: "Facial Exercises", desc: "Smile wide, puff cheeks, raise eyebrows — hold 5 sec each", icon: "😊" },
  { id: 5, name: "Deep Breathing", desc: "Inhale 4 counts, hold 4, exhale 6. Repeat 10 times.", icon: "🌬️" },
];
export default function PatientDashboard() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState({ tremor: 3, rigidity: 3, mood: 3, fatigue: 3 });
  const [completed, setCompleted] = useState({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const ref = doc(db, "patients", user.uid, "logs", today);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSymptoms(snap.data().symptoms || { tremor: 3, rigidity: 3, mood: 3, fatigue: 3 });
        setCompleted(snap.data().completed || {});
      }
    };
    if (user) load();
  }, [user]);
  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
    const ref = doc(db, "patients", user.uid, "logs", today);
    await setDoc(ref, { symptoms, completed, date: today, timestamp: serverTimestamp() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const toggleExercise = (id) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  const completedCount = Object.values(completed).filter(Boolean).length;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-indigo-800 mb-1">Good morning 👋</h2>
          <p className="text-gray-500 text-sm mb-6">Today is {new Date().toDateString()}. How are you feeling?</p>
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">📊 Daily Symptom Check</h3>
          <div className="space-y-5">
            {Object.entries(symptoms).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <span className="text-sm text-indigo-600 font-bold">{val}/5</span>
                </div>
                <input type="range" min="1" max="5" value={val} onChange={e => setSymptoms(prev => ({ ...prev, [key]: Number(e.target.value) }))} className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Mild</span><span>Severe</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-700">🤸 Motor Exercises</h3>
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">{completedCount}/{exercises.length} done</span>
          </div>
          <div className="space-y-3">
            {exercises.map(ex => (
              <div key={ex.id} onClick={() => toggleExercise(ex.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border-2 transition ${completed[ex.id] ? "border-green-400 bg-green-50" : "border-gray-100 hover:border-indigo-200"}`}>
                <span className="text-2xl">{ex.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{ex.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ex.desc}</p>
                </div>
                <span className={`text-xl ${completed[ex.id] ? "text-green-500" : "text-gray-200"}`}>✓</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button onClick={handleSave} className="flex-1 bg-indigo-700 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-800 transition">
            {saved ? "✅ Saved!" : "Save Today's Log"}
          </button>
          <Link to="/chatbot" className="flex-1 text-center bg-white border-2 border-indigo-300 text-indigo-700 py-3 rounded-2xl font-semibold hover:bg-indigo-50 transition">🤖 Talk to AI Companion</Link>
        </div>
      </div>
    </div>
  );
}
