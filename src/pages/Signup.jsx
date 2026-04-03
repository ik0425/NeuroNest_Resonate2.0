import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8 text-sm">Join NeuroNest as a patient or caregiver</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Password (min 6 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="flex gap-3">
            {["patient", "caregiver"].map(r => (
              <button type="button" key={r} onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition ${role === r ? "bg-indigo-700 text-white border-indigo-700" : "border-gray-200 text-gray-500 hover:border-indigo-300"}`}>
                {r === "patient" ? "🧑⚕️ Patient" : "👨👩👧 Caregiver"}
              </button>
            ))}
          </div>
          <button type="submit" className="w-full bg-indigo-700 text-white py-3 rounded-xl font-semibold hover:bg-indigo-800 transition">Create Account</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link></p>
      </div>
    </div>
  );
}
