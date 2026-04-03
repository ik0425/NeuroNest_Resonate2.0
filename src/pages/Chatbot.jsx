import { useState, useRef, useEffect } from "react";
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your NeuroNest AI companion 🧠 I'm here to support you emotionally, answer health questions, and remind you about your exercises. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: "You are a compassionate AI health companion for Parkinson's disease patients. Be warm, encouraging, and helpful. Offer emotional support, remind patients about exercises, answer health questions clearly, and always recommend consulting a doctor for medical decisions." }] },
          contents: [...history, { role: "user", parts: [{ text: currentInput }] }]
        })
      });
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you. Could you tell me more?";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't connect right now. Please try again." }]);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col" style={{ height: "80vh" }}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-indigo-800">🤖 AI Companion</h2>
          <p className="text-xs text-gray-400 mt-1">Powered by Gemini AI · Always here for you</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-indigo-700 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>{m.text}</div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button onClick={sendMessage} disabled={loading} className="bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-800 transition disabled:opacity-50">Send</button>
        </div>
      </div>
    </div>
  );
}
