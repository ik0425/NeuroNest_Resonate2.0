import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FadeUpSection = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.8, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroTextY = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-primary overflow-hidden"
    >
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center origin-top lg:bg-fixed"
          style={{ y: heroBgY, backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1800')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(109,191,158,0.55)] to-[rgba(139,156,244,0.45)]"></div>
        
        <motion.div style={{ y: heroTextY }} className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-block glass-card text-white text-sm font-semibold px-5 py-2 rounded-full mb-8 shadow-sm">
            For Parkinson's Patients & Caregivers
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white text-shadow-sm leading-tight mb-8">
            Your Daily Companion<br />for Parkinson's Care
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-xl text-white/95 max-w-2xl mx-auto mb-10 text-shadow-sm font-medium">
            NeuroNest helps patients track symptoms, complete therapeutic exercises, and stay emotionally supported — while keeping caregivers informed in real time.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup" className="text-sage px-8 py-3.5 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300" style={{ background: "linear-gradient(135deg, #fdfdfd, #f0f4ff)" }}>Get Started</Link>
            <Link to="/login" className="glass-card text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-white/20 transition-all duration-300">Login</Link>
          </motion.div>
        </motion.div>
      </div>

      <svg className="w-full h-12 md:h-24 -mt-1 relative z-20 text-primary fill-current" viewBox="0 0 1440 74" preserveAspectRatio="none">
        <path d="M0,0 C240,74 480,74 720,37 C960,0 1200,0 1440,37 L1440,74 L0,74 Z"></path>
      </svg>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "📊", title: "Symptom Tracking", desc: "Log tremors, rigidity, mood and fatigue daily with simple sliders. Visualize trends over time.", delay: 0.1 },
            { icon: "🤸", title: "Motor Exercises", desc: "Follow guided fine motor exercises designed for Parkinson's patients. Track your completion streak.", delay: 0.2 },
            { icon: "🤖", title: "AI Companion", desc: "Talk to a Gemini-powered chatbot for emotional support, medication reminders, and health Q&A.", delay: 0.3 },
          ].map((f, i) => (
            <FadeUpSection key={f.title} delay={f.delay}>
              <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-8 shadow-[0_8px_30px_rgba(30,42,94,0.04)] border border-white hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(30,42,94,0.08)] transition-all duration-400 cursor-default h-full">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-slate/5">{f.icon}</div>
                <h3 className="font-bold text-navy mb-3">{f.title}</h3>
                <p className="text-slate text-sm">{f.desc}</p>
              </div>
            </FadeUpSection>
          ))}
        </div>

        <FadeUpSection delay={0.2} className="mt-24">
          <div className="rounded-[32px] p-10 md:p-16 relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #1E2A5E, #8B9CF4)" }}>
            <div className="relative z-10 text-center">
              <h2 className="text-white font-bold mb-4">For Caregivers & Family</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 font-sans">
                Monitor your loved one's daily symptoms, exercise completion, and receive instant alerts when something needs attention. Peace of mind, delivered beautifully.
              </p>
              <Link to="/signup" className="inline-block bg-blush text-navy px-8 py-3.5 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-all duration-300">Join as a Caregiver</Link>
            </div>
            {/* Soft background decor */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-sage opacity-20 rounded-full mix-blend-screen filter blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blush opacity-20 rounded-full mix-blend-screen filter blur-3xl"></div>
          </div>
        </FadeUpSection>
      </div>
    </motion.div>
  );
}
