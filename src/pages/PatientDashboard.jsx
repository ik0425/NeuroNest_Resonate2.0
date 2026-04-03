import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const exercises = [
  { id: 1, name: "Finger Tapping", diff: "Easy", duration: "2 min", desc: "Tap each finger to your thumb 10 times each hand", icon: "👆" },
  { id: 2, name: "Wrist Rotation", diff: "Easy", duration: "3 min", desc: "Rotate wrists clockwise and counter-clockwise 15 times", icon: "🔄" },
  { id: 3, name: "Hand Squeeze", diff: "Moderate", duration: "5 min", desc: "Squeeze a soft ball or rolled towel 20 times each hand", icon: "✊" },
  { id: 4, name: "Facial Exercises", diff: "Easy", duration: "2 min", desc: "Smile wide, puff cheeks, raise eyebrows — hold 5 sec each", icon: "😊" },
  { id: 5, name: "Deep Breathing", diff: "Easy", duration: "5 min", desc: "Inhale 4 counts, hold 4, exhale 6. Repeat 10 times.", icon: "🌬️" },
];

const mockSparkData = [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }];

const Sparkline = () => (
  <div className="h-10 w-20 mt-1 opacity-60">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockSparkData}>
        <Line type="monotone" dataKey="v" stroke="#8B9CF4" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={1500} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function PatientDashboard() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState({ tremor: 3, rigidity: 3, mood: 3, fatigue: 3 });
  const [completed, setCompleted] = useState({});
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [activeEx, setActiveEx] = useState(null);

  useEffect(() => {
    const load = async () => {
      const uSnap = await getDoc(doc(db, "users", user.uid));
      if (uSnap.exists()) setName(uSnap.data().name.split(" ")[0]);

      const today = new Date().toISOString().split("T")[0];
      const snap = await getDoc(doc(db, "patients", user.uid, "logs", today));
      if (snap.exists()) {
        setSymptoms(snap.data().symptoms || { tremor: 3, rigidity: 3, mood: 3, fatigue: 3 });
        setCompleted(snap.data().completed || {});
      }
      setTimeout(() => setScore(84), 400); // Animate score
    };
    if (user) load();
  }, [user]);

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
    await setDoc(doc(db, "patients", user.uid, "logs", today), { symptoms, completed, date: today, timestamp: serverTimestamp() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleExercise = (id) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  const completedCount = Object.values(completed).filter(Boolean).length;
  const circumference = 2 * Math.PI * 45;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-24 pb-20 px-4 sm:px-8 bg-primary">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header & Score Ring */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1">
             <h2 className="text-4xl font-bold text-navy mb-2 overflow-hidden border-r-2 border-sage whitespace-nowrap animate-[typing_2s_steps(40,end)]">
               Good morning, {name || "Friend"} 🌿
             </h2>
             <p className="text-slate text-lg">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
           </motion.div>
           
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="relative w-32 h-32 flex items-center justify-center glass-card rounded-full p-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(109,191,158,0.1)" strokeWidth="6" fill="transparent" />
                <motion.circle cx="50" cy="50" r="45" stroke="#6DBF9E" strokeWidth="6" fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-navy">{Math.round(score)}</span>
                <span className="text-[10px] text-slate uppercase tracking-wider">Wellness</span>
              </div>
           </motion.div>
        </div>

        {/* 2x2 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: "Tremor", val: "Mild", type: "tremor" },
            { tag: "Mood", val: "Good", type: "mood" },
            { tag: "Exercises", val: `${completedCount}/${exercises.length}` },
            { tag: "Meds", val: "Taken" }
          ].map((m, i) => (
             <motion.div key={m.tag} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="glass-card rounded-[20px] p-5 hover:-translate-y-2 transition-transform duration-300">
               <p className="text-xs text-slate uppercase tracking-wider mb-1">{m.tag}</p>
               <p className="text-2xl font-bold text-navy">{m.val}</p>
               <Sparkline />
             </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Symptom Timeline */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-8 relative">
            <h3 className="text-xl font-bold text-navy mb-6">Daily Symptom Log</h3>
            <div className="space-y-6 relative border-l-2 border-slate/10 pl-6 ml-2">
              {Object.entries(symptoms).map(([key, val], i) => (
                <motion.div key={key} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                  <div className="absolute -left-[33px] top-1 w-3.5 h-3.5 rounded-full bg-sage shadow-[0_0_0_4px_rgba(109,191,158,0.2)]"></div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold capitalize text-navy">{key}</span>
                    <span className="text-xs font-bold bg-primary px-2 py-0.5 rounded text-sage">{val}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={val} onChange={e => setSymptoms({ ...symptoms, [key]: Number(e.target.value) })} className="w-full accent-sage mt-2" />
                </motion.div>
              ))}
            </div>
            <button onClick={handleSave} className="mt-8 w-full py-3 rounded-xl bg-sage/10 text-sage font-bold hover:bg-sage hover:text-white transition-all">
              {saved ? "Logged Successfully ✓" : "Update Symptoms"}
            </button>
          </motion.div>

          {/* Exercises Horizontal Strip -> Vertical Grid */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-[24px] p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy">Exercises prescribed</h3>
                <span className="bg-sage/10 text-sage text-xs font-bold px-3 py-1 rounded-full">{Math.round((completedCount/exercises.length)*100)}% Done</span>
             </div>
             
             <div className="flex overflow-x-auto lg:grid lg:grid-cols-1 gap-4 pb-4 snap-x">
               {exercises.map(ex => (
                  <motion.div 
                    layout
                    key={ex.id} 
                    className={`min-w-[240px] shrink-0 lg:w-full snap-center border-[1.5px] rounded-2xl p-4 transition-all overflow-hidden ${completed[ex.id] ? "border-sage bg-sage/5" : "border-slate/10 hover:border-periwinkle"}`}
                  >
                    <div className="flex gap-4 items-start cursor-pointer" onClick={() => setActiveEx(activeEx === ex.id ? null : ex.id)}>
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-2xl shrink-0">{ex.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-navy text-sm">{ex.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-slate bg-primary px-2 py-0.5 rounded">{ex.diff}</span>
                          <span className="text-[10px] uppercase font-bold text-slate bg-primary px-2 py-0.5 rounded">{ex.duration}</span>
                        </div>
                      </div>
                      {completed[ex.id] && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center text-xs">✓</motion.div>}
                    </div>

                    <AnimatePresence>
                      {activeEx === ex.id && !completed[ex.id] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 border-t border-slate/10 mt-4 overflow-hidden">
                          <p className="text-xs text-slate mb-4">{ex.desc}</p>
                          <button onClick={(e) => { e.stopPropagation(); toggleExercise(ex.id); setActiveEx(null); }} className="w-full py-2 rounded-lg bg-periwinkle text-white text-sm font-bold shadow-md hover:scale-[1.02] transition-transform">
                            Mark as Done
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
               ))}
             </div>
          </motion.div>
        </div>
        
      </div>

      {/* Floating Action Log */}
      <Link to="/chatbot">
        <motion.div 
          className="fixed bottom-8 right-8 w-14 h-14 bg-periwinkle rounded-full shadow-[0_4px_24px_rgba(139,156,244,0.4)] flex items-center justify-center text-2xl z-50 hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0 4px 24px rgba(139,156,244,0.4)", "0 4px 32px rgba(139,156,244,0.7)", "0 4px 24px rgba(139,156,244,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤖
        </motion.div>
      </Link>
    </motion.div>
  );
}
