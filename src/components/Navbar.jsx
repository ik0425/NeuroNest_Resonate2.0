import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-8 flex justify-between items-center transition-all duration-500 ${isScrolled ? "glass-nav py-3" : "bg-transparent py-5"}`}>
      <Link to="/" className="text-2xl font-bold tracking-wide text-navy drop-shadow-sm font-serif">
        🧠 NeuroNest
      </Link>
      <div className="flex gap-6 items-center text-sm font-medium">
        {!user && <Link to="/login" className="text-slate hover:text-navy transition">Login</Link>}
        {!user && <Link to="/signup" className="bg-sage text-white px-5 py-2 rounded-full hover:scale-105 transition hover:shadow-lg focus-ring-sage">Sign Up</Link>}
        {user && role === "patient" && <Link to="/patient" className="text-slate hover:text-navy transition">Dashboard</Link>}
        {user && role === "patient" && <Link to="/chatbot" className="text-slate hover:text-navy transition">AI Companion</Link>}
        {user && role === "caregiver" && <Link to="/caregiver" className="text-slate hover:text-navy transition">Caregiver View</Link>}
        {user && <button onClick={handleLogout} className="border border-slate text-slate px-5 py-2 rounded-full hover:bg-slate hover:text-white transition focus-ring-sage">Logout</button>}
      </div>
    </nav>
  );
}
