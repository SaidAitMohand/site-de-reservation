import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import OwnerDashboard from "./Pages/OwnerDashboard"; // Import de la nouvelle page

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Page de connexion ROOMBOOK */}
        <Route path="/login" element={<Login />} />

        {/* Page d'inscription ROOMBOOK */}
        <Route path="/register" element={<Register />} />

        {/* Interface Propriétaire (Dashboard) */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        
        {/* Page 404 corrigée */}
        <Route path="*" element={
          <div className="h-screen bg-[#F9F6F2] flex flex-col items-center justify-center font-serif italic text-center px-4">
            <h1 className="text-8xl text-[#0F0F0F] opacity-10">404</h1>
            <div className="absolute flex flex-col items-center">
               <p className="text-[#B38B59] uppercase tracking-[0.4em] text-[12px] font-sans font-bold">
                Espace introuvable
              </p>
              <Link to="/" className="mt-8 text-[10px] uppercase tracking-[0.2em] border-b border-[#0F0F0F] pb-1 hover:text-[#B38B59] hover:border-[#B38B59] transition-all">
                Retour à l'expérience ROOMBOOK
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}