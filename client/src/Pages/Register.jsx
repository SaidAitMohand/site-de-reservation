import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "", // Changé de 'email' à 'username'
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const dataToSubmit = {
      name: `${formData.firstname} ${formData.lastname}`,
      username: formData.username, // Envoi de l'identifiant libre
      password: formData.password,
      role: userType === 'owner' ? 'proprietaire' : 'client'
    };

    try {
      const response = await fetch("http://localhost:4000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Bienvenue chez ROOMBOOK !");
        navigate("/login");
      } else {
        setError(data.erreur || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Le serveur est hors ligne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] flex flex-col font-light">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-12">
        <div className="w-full max-w-[550px] bg-white border border-[#0F0F0F]/5 p-10 md:p-16 shadow-2xl">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif italic text-[#0F0F0F]">Créer un compte</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B38B59] mt-2 font-bold italic">L'excellence commence ici</p>
          </div>

          {!userType ? (
            <div className="space-y-6">
              <button onClick={() => setUserType('client')} className="w-full group border border-[#0F0F0F]/10 p-8 text-left hover:bg-[#0F0F0F] transition-all duration-500">
                <h3 className="font-serif text-xl group-hover:text-[#B38B59] italic">Je cherche un espace</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1 group-hover:text-white">Accès client</p>
              </button>
              <button onClick={() => setUserType('owner')} className="w-full group border border-[#0F0F0F]/10 p-8 text-left hover:bg-[#0F0F0F] transition-all duration-500">
                <h3 className="font-serif text-xl group-hover:text-[#B38B59] italic">Je propose un lieu</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1 group-hover:text-white">Partenaire propriétaire</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500 text-[9px] font-bold uppercase p-3 bg-red-50 border-l-2 border-red-500">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b border-stone-200 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Prénom</label>
                  <input name="firstname" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" />
                </div>
                <div className="flex flex-col border-b border-stone-200 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Nom</label>
                  <input name="lastname" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" />
                </div>
              </div>

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50">Nom d'utilisateur (Identifiant)</label>
                <input 
                    name="username" 
                    type="text" 
                    required 
                    onChange={handleInputChange} 
                    className="bg-transparent outline-none italic" 
                    placeholder="Ex: kenza.aab"
                />
              </div>

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50">Mot de passe</label>
                <input name="password" type="password" required onChange={handleInputChange} className="bg-transparent outline-none" />
              </div>

              <div className="pt-6 space-y-4">
                <button type="submit" disabled={loading} className="w-full bg-[#0F0F0F] text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#B38B59] transition-all">
                  {loading ? "Création..." : `S'inscrire comme ${userType === 'owner' ? 'Hôte' : 'Client'}`}
                </button>
                <button type="button" onClick={() => setUserType(null)} className="w-full text-[9px] uppercase opacity-40 hover:opacity-100 italic">← Retour</button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}