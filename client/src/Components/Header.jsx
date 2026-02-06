import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ userName = "KABICHE Karine", onOpenSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Souhaitez-vous vous déconnecter de ROOMBOOK ?")) {
      navigate("/");
    }
  };

  return (
    <header className="bg-white border border-[#0F0F0F]/5 p-6 mb-12 shadow-sm flex justify-between items-center relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#0F0F0F] text-white flex items-center justify-center font-serif italic text-xl shadow-lg">
          {userName.charAt(0)}
        </div>
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#0F0F0F]">{userName}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] uppercase opacity-50 font-bold tracking-tighter">Propriétaire Connectée</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[10px] uppercase tracking-widest font-bold border border-stone-200 px-6 py-3 hover:bg-black hover:text-white transition-all duration-300"
        >
          Compte {isMenuOpen ? "▲" : "▼"}
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute right-0 mt-3 w-56 bg-[#F9F6F2] border border-[#0F0F0F]/10 shadow-2xl z-20 p-5 space-y-4">
              <button 
                onClick={() => { onOpenSettings(); setIsMenuOpen(false); }}
                className="block w-full text-left text-[10px] uppercase font-bold hover:text-[#B38B59] transition-colors"
              >
                Sécurité & Password
              </button>
              <div className="h-[1px] bg-stone-200 w-full"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left text-[10px] uppercase font-bold text-red-500 hover:tracking-widest transition-all"
              >
                Se déconnecter
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}