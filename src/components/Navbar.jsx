import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };
  return (
    <nav className="bg-indigo-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide">🧠 NeuroNest</Link>
      <div className="flex gap-6 items-center text-sm font-medium">
        {!user && <Link to="/login" className="hover:underline">Login</Link>}
        {!user && <Link to="/signup" className="bg-white text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-100">Sign Up</Link>}
        {user && role === "patient" && <Link to="/patient" className="hover:underline">Dashboard</Link>}
        {user && role === "patient" && <Link to="/chatbot" className="hover:underline">AI Companion</Link>}
        {user && role === "caregiver" && <Link to="/caregiver" className="hover:underline">Caregiver View</Link>}
        {user && <button onClick={handleLogout} className="bg-white text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-100">Logout</button>}
      </div>
    </nav>
  );
}
