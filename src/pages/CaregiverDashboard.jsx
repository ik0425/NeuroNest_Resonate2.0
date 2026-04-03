import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function CaregiverDashboard() {
  const [patients, setPatients] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const snap = await getDocs(collection(db, "patients"));
      const patientList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPatients(patientList);
      
      const today = new Date().toISOString().split("T")[0];
      const logMap = {};
      for (const p of patientList) {
        const lp = await getDoc(doc(db, "patients", p.id, "logs", today));
        logMap[p.id] = lp.exists() ? lp.data() : null;
      }
      setLogs(logMap);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getSeverity = (syms) => {
    if (!syms) return "none";
    const avg = Object.values(syms).reduce((a,b)=>a+b,0)/4;
    return avg >= 4 ? "high" : avg >= 3 ? "medium" : "low";
  };

  const badgeStyles = { high: "bg-blush/20 text-red-700", medium: "bg-orange-100 text-orange-700", low: "bg-sage/20 text-green-800", none: "bg-slate/10 text-slate" };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-primary text-navy font-bold font-serif text-2xl">Loading Records...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-primary pb-20">
      
      {/* Header Overlay */}
      <div className="relative h-[35vh] flex items-end p-8 lg:p-16 object-cover bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1400')`, backgroundAttachment: "fixed" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent"></div>
        <div className="relative z-10 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Caregiver View</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-5xl font-serif font-bold text-shadow-sm">Patient Overview</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/80 mt-2 font-sans">{new Date().toDateString()}</motion.p>
        </div>
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {alert && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }} className="max-w-5xl mx-auto px-6 mt-8 overflow-hidden rounded-2xl">
            <div className="bg-blush/20 border border-blush/50 p-4 shrink-0 flex justify-between items-center rounded-2xl mb-2">
              <span className="text-sm text-red-900 font-bold px-4 flex items-center gap-3">
                <span className="animate-pulse text-xl">⚠️</span> Patient Sarah has reported high tremor severity today.
              </span>
              <button onClick={() => setAlert(false)} className="px-3 hover:opacity-50 transition text-red-900">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        {patients.length === 0 && <p className="text-center p-8 text-slate glass-card rounded-2xl">No patients enrolled yet.</p>}
        
        {patients.map((p, idx) => {
          const log = logs[p.id];
          const sev = getSeverity(log?.symptoms);
          const comp = log?.completed ? Object.values(log.completed).filter(Boolean).length : 0;
          const pieData = [{ name: "Done", value: comp }, { name: "Left", value: 5 - comp }];
          const COLORS = ["#6DBF9E", "rgba(90, 100, 130, 0.1)"];

          return (
            <motion.div layoutId={`card-${p.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={p.id} className="glass-card rounded-[24px] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-center border-[1.5px] border-white/50 hover:border-white shadow-sm hover:shadow-[0_8px_30px_rgba(30,42,94,0.06)] transition-all">
               
               <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-navy">{p.name}</h3>
                      <p className="text-sm text-slate">{p.email}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${badgeStyles[sev]}`}>
                      {sev === 'none'? "No Logs" : sev}
                    </span>
                  </div>

                  {log ? (
                    <div className="grid grid-cols-4 gap-3 bg-white/50 rounded-2xl p-4">
                       {Object.entries(log.symptoms).map(([k,v]) => (
                         <div key={k} className="text-center border-r border-slate/10 last:border-0 relative">
                           <p className="text-[10px] text-slate uppercase tracking-wider mb-1">{k}</p>
                           <p className="font-bold text-navy text-lg">{v}<span className="text-xs text-slate font-normal">/5</span></p>
                           {v >= 4 && <span className="absolute top-0 right-1 w-2 h-2 bg-blush rounded-full"></span>}
                         </div>
                       ))}
                    </div>
                  ) : <div className="bg-white/30 rounded-2xl p-6 text-center text-sm font-medium text-slate">Awaiting daily log check-in...</div>}
               </div>

               <div className="w-full lg:w-48 flex flex-col items-center gap-3 shrink-0">
                  <div className="h-24 w-24 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={35} outerRadius={48} paddingAngle={2} dataKey="value" stroke="none" isAnimationActive={true}>
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-navy text-xl">{comp}</div>
                  </div>
                  <p className="text-[10px] text-slate uppercase tracking-wider font-bold">Exercises</p>
                  
                  <button onClick={() => setActiveModal(p.name)} className="w-full mt-2 py-2 bg-periwinkle/10 text-periwinkle text-sm font-bold rounded-xl hover:bg-periwinkle hover:text-white transition">Message Patient</button>
               </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl">
               <h3 className="text-xl font-bold text-navy mb-4">Message {activeModal}</h3>
               <textarea className="w-full bg-slate/5 border border-slate/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle min-h-[120px] resize-none" placeholder="Write an encouraging note..." autoFocus></textarea>
               <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm font-medium text-slate hover:text-navy">Cancel</button>
                 <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm font-bold bg-periwinkle text-white rounded-xl shadow-md hover:scale-105 transition">Send Note</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
