import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), { name, email, role, createdAt: new Date() });
      if (role === "patient") {
        await setDoc(doc(db, "patients", res.user.uid), { name, email, uid: res.user.uid });
      }
      navigate(role === "patient" ? "/patient" : "/caregiver");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col md:flex-row bg-primary overflow-hidden"
    >
      <div 
        className="hidden md:flex w-[55%] relative items-center justify-center p-12 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1400')`, backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-[rgba(250,247,255,0.6)]"></div>
        <motion.p 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 text-4xl lg:text-5xl font-serif text-navy italic text-center leading-relaxed text-shadow-sm px-8"
        >
          "Healing is a matter of time, but it is sometimes also a matter of opportunity."
        </motion.p>
      </div>

      <div className="w-full md:w-[45%] min-h-screen relative flex items-center justify-center p-6 lg:p-12 z-10 bg-primary/40 backdrop-blur-3xl pt-24">
        <div className="absolute top-1/4 left-1/4 w-[120px] h-[120px] bg-sage rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-levitate z-[-1]"></div>
        <div className="absolute top-1/3 right-1/4 w-[120px] h-[120px] bg-periwinkle rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-bob z-[-1]" style={{ animationDelay: "1s" }}></div>
        
        <motion.div 
          className="w-full max-w-md glass-card rounded-[24px] p-8 lg:p-12 shadow-[0_8px_32px_rgba(30,42,94,0.08)] relative z-10"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
        >
          <div className="mb-4 flex justify-center">
             <svg className="w-10 h-10 text-sage animate-breathe" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C7.58172 2 4 5.58172 4 10C4 11.4556 4.38883 12.8202 5.06646 14C5.46513 14.6941 5.94584 15.334 6.49504 15.9082C7.45 16.9068 7.33235 18.0673 7 19.5C6.91001 19.8879 7.15177 20.2818 7.54593 20.3705C7.94008 20.4592 8.35824 20.2505 8.51326 19.8732C9.00693 18.671 9.57688 18 10.5 18H13.5C14.4231 18 14.9931 18.671 15.4867 19.8732C15.6418 20.2505 16.0599 20.4592 16.4541 20.3705C16.8482 20.2818 17.09 19.8879 17 19.5C16.6676 18.0673 16.55 16.9068 17.505 15.9082M12 15V15.01" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-navy mb-2 text-center">Create Account</h2>
          <p className="text-slate mb-6 text-center text-sm font-medium">Join NeuroNest as a patient or caregiver</p>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center border border-red-100">{error}</div>}
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative group">
              <input className="w-full bg-transparent border-b-2 border-slate/20 px-2 py-3 text-sm focus:outline-none placeholder-slate/50 peer" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage transition-all duration-300 peer-focus:w-full"></span>
            </div>
            <div className="relative group">
              <input className="w-full bg-transparent border-b-2 border-slate/20 px-2 py-3 text-sm focus:outline-none placeholder-slate/50 peer" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage transition-all duration-300 peer-focus:w-full"></span>
            </div>
            <div className="relative group">
              <input className="w-full bg-transparent border-b-2 border-slate/20 px-2 py-3 text-sm focus:outline-none placeholder-slate/50 peer" placeholder="Password (min 6 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage transition-all duration-300 peer-focus:w-full"></span>
            </div>
            
            <div className="flex gap-4">
              {["patient", "caregiver"].map(r => (
                <button type="button" key={r} onClick={() => setRole(r)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${role === r ? "bg-sage text-white shadow-md scale-[1.02]" : "bg-transparent border border-slate/20 text-slate hover:border-sage"}`}>
                  {r === "patient" ? "🧑‍⚕️ Patient" : "👩‍👧 Caregiver"}
                </button>
              ))}
            </div>

            <button type="submit" className="w-full px-4 py-3.5 rounded-full font-semibold text-white shadow-lg transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #6DBF9E, #8B9CF4)" }}>
              Create Account
            </button>
          </form>
          
          <p className="text-center text-sm text-slate mt-6">Already have an account? <Link to="/login" className="text-periwinkle font-semibold hover:text-sage transition-colors">Sign In</Link></p>
        </motion.div>
      </div>
    </motion.div>
  );
}
