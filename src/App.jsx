import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import Chatbot from "./pages/Chatbot";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/patient" element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/caregiver" element={<ProtectedRoute allowedRole="caregiver"><CaregiverDashboard /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute allowedRole="patient"><Chatbot /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
