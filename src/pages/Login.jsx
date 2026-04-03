import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, role } = useAuth();
  useEffect(() => {
    if (user && role) navigate(role === "patient" ? "/patient" : "/caregiver");
  }, [user, role]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8 text-sm">Login to your NeuroNest account</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-indigo-700 text-white py-3 rounded-xl font-semibold hover:bg-indigo-800 transition">Login</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign Up</Link></p>
      </div>
    </div>
  );
}
