import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[150] bg-[#0F0F0F] border-b border-[#B38B59]/10 px-6 md:px-16 py-4">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center font-serif">
        
        <Link to="/" className="text-2xl tracking-[0.2em] font-bold uppercase text-white">
          ROOM<span className="text-[#B38B59]">BOOK</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-bold">
          <div className="flex gap-8 border-r border-white/10 pr-8">
            <Link to="/" className="text-white/60 hover:text-[#B38B59] transition-colors">Explorer</Link>
            <Link to="/about" className="text-white/60 hover:text-[#B38B59] transition-colors">À Propos</Link>
          </div>
          
          <div className="flex items-center gap-5">
            <Link 
              to="/login" 
              className="text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-[#1A1A1A] transition-all duration-500"
            >
              Se Connecter
            </Link>
            <Link 
              to="/register" 
              className="bg-[#B38B59] text-[#1A1A1A] px-7 py-3 hover:bg-white transition-all duration-500 shadow-lg"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="md:hidden text-[#B38B59]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </div>
    </nav>
  );
}