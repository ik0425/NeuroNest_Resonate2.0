import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">For Parkinson's Patients & Caregivers</div>
        <h1 className="text-6xl font-extrabold text-indigo-900 leading-tight mb-6">Your Daily Companion<br />for Parkinson's Care</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">NeuroNest helps patients track symptoms, complete therapeutic exercises, and stay emotionally supported — while keeping caregivers informed in real time.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup" className="bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-800 transition">Get Started</Link>
          <Link to="/login" className="border-2 border-indigo-700 text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition">Login</Link>
        </div>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: "📊", title: "Symptom Tracking", desc: "Log tremors, rigidity, mood and fatigue daily with simple sliders. Visualize trends over time." },
            { icon: "🤸", title: "Motor Exercises", desc: "Follow guided fine motor exercises designed for Parkinson's patients. Track your completion streak." },
            { icon: "🤖", title: "AI Companion", desc: "Talk to a Gemini-powered chatbot for emotional support, medication reminders, and health Q&A." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-indigo-700 text-white rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-3">For Caregivers & Family</h2>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">Monitor your loved one's daily symptoms, exercise completion, and receive instant alerts when something needs attention.</p>
        </div>
      </div>
    </div>
  );
}
