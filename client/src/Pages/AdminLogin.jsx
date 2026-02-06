import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- LISTE DES ADMINS AUTORISÉS ---
  const adminList = [
    { email: "admin@roombook.dz", password: "admin2026", name: "SUPER-ADMIN" },
    { email: "mounir@roombook.dz", password: "mounir2026", name: "MOUNIR B." },
    { email: "sarah@roombook.dz", password: "sarah2026", name: "SARAH K." }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const auth = adminList.find(a => a.email === email && a.password === password);

    if (auth) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminName", auth.name);
      navigate("/admin-dashboard"); 
    } else {
      setError("Identifiants incorrects. Accès refusé.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center px-6 text-[#0F0F0F]">
      <div className="max-w-md w-full bg-white border border-stone-200 shadow-sm p-10 md:p-14">
        <div className="text-center mb-12">
          <h1 className="font-serif italic text-4xl">RoomBook</h1>
          <div className="h-[1px] w-12 bg-[#B38B59] mx-auto mt-4"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-6 font-bold">Accès Administrateur</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Email de connexion</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm transition-all"
            />
          </div>

          <div>
            <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 border-l-2 border-red-500">
              <p className="text-[10px] text-red-600 font-bold uppercase">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full bg-[#0F0F0F] text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#B38B59] transition-all duration-500">
            Entrer dans la console
          </button>
        </form>

        {/* LIEN DE RÉCUPÉRATION AJOUTÉ ICI */}
        <div className="mt-10 text-center border-t border-stone-50 pt-6">
          <Link 
            to="/admin-forgot-password" 
            className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 hover:text-[#B38B59] transition-all"
          >
            Mot de passe oublié ? Récupération par Email
          </Link>
        </div>
      </div>
    </div>
  );
}