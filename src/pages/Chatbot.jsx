import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your NeuroNest AI companion 🧠 I'm here to support you emotionally, answer health questions, and remind you about your exercises. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    try {
      // Exclude the initial hardcoded assistant message because Gemini API requires history to start with a 'user' role
      const historyFormatted = messages.map(m => ({ 
        role: m.role, 
        content: m.text 
      }));
      
      const groqHistory = [
        { role: "system", content: "You are NeuroCompanion, a warm and empathetic AI assistant for Parkinson's disease patients. Respond with compassion, offer practical advice when appropriate, and always acknowledge their feelings first. If they mention pain or symptoms, ask specific follow-up questions and suggest they log it in their symptom tracker." },
        ...historyFormatted,
        { role: "user", content: currentInput }
      ];

      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqHistory
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Groq API error");
      }
      
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("No text found in generated content");
      
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Chatbot API Error:", err);
      setMessages(prev => [...prev, { role: "assistant", text: `I'm having trouble connecting right now. (${err.message}) Please try again.` }]);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[100dvh] bg-[#FFF5F3] pt-24 pb-4 px-4 flex flex-col relative overflow-hidden font-chat">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(244,168,154,0.15) 0%, transparent 70%)" }}></div>
      
      <div className="max-w-3xl w-full mx-auto glass-card flex-1 rounded-[32px] flex flex-col overflow-hidden shadow-[0_12px_40px_rgba(244,168,154,0.15)] relative z-10 h-[calc(100vh-120px)]">
        
        <div className="p-6 border-b border-blush/20 flex flex-col items-center bg-white/40 backdrop-blur-md shrink-0">
          <svg className="w-16 h-16 text-blush animate-breathe drop-shadow-sm mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C7.58172 2 4 5.58172 4 10C4 11.4556 4.38883 12.8202 5.06646 14C5.46513 14.6941 5.94584 15.334 6.49504 15.9082C7.45 16.9068 7.33235 18.0673 7 19.5C6.91001 19.8879 7.15177 20.2818 7.54593 20.3705C7.94008 20.4592 8.35824 20.2505 8.51326 19.8732C9.00693 18.671 9.57688 18 10.5 18H13.5C14.4231 18 14.9931 18.671 15.4867 19.8732C15.6418 20.2505 16.0599 20.4592 16.4541 20.3705C16.8482 20.2818 17.09 19.8879 17 19.5C16.6676 18.0673 16.55 16.9068 17.505 15.9082M12 15V15.01" />
          </svg>
          <h2 className="text-xl font-bold text-navy font-serif">NeuroCompanion API</h2>
          <p className="text-[10px] text-slate font-sans uppercase tracking-widest mt-1 font-bold">Always Listening</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] px-6 py-4 text-[17px] leading-relaxed shadow-sm ${
                    m.role === "user" 
                    ? "rounded-[24px] rounded-br-[8px] text-white" 
                    : "rounded-[24px] rounded-bl-[8px] bg-white border border-blush/30 text-navy"
                  }`}
                  style={m.role === "user" ? { background: "linear-gradient(135deg, #8B9CF4, #A6B4F8)" } : {}}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex justify-start">
                <div className="px-6 py-4 rounded-[24px] rounded-bl-[8px] bg-white border border-blush/30 flex gap-2 items-center h-14">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-blush"></motion.div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-blush"></motion.div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-blush"></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4" />
        </div>

        <div className="p-4 bg-white/60 backdrop-blur-xl border-t border-blush/20 shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-3 bg-white border-2 border-blush/20 rounded-full p-2 pl-6 shadow-sm focus-within:border-sage transition-colors">
            <svg className="w-6 h-6 text-slate shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Share how you're feeling..." className="flex-1 bg-transparent border-none focus:ring-0 text-[17px] outline-none text-navy placeholder-slate/40 font-sans disabled:opacity-50" disabled={loading} autoFocus />
            <motion.button animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }} onClick={sendMessage} disabled={loading || !input.trim()} className="w-12 h-12 bg-periwinkle rounded-full flex items-center justify-center text-white shrink-0 hover:bg-navy transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path></svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
