import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Erreur de connexion");
        return;
      }

      const data = await res.json();
      // data = { name: "SUPER-ADMIN", token: "xxx" } par exemple

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminName", data.name);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      setError("Impossible de se connecter au serveur");
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
            <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Nom d'utilisateur</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

      </div>
    </div>
  );
}
