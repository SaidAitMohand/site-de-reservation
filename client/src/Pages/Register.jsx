import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'client' ou 'owner'
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || formData.name.length < 3) {
      setError("Veuillez entrer votre nom complet (au moins 3 caractères).");
      return;
    }

    if (formData.username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!userType) {
      setError("Veuillez choisir un type de profil.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.erreur || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || "Compte créé avec succès !");
      setLoading(false);

      // rediriger après 3 secondes
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      setError("Erreur serveur. Vérifiez la connexion.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] selection:bg-[#B38B59] selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-12">
        <div className="w-full max-w-[550px] bg-white border border-[#0F0F0F]/5 p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">

          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-serif text-[#0F0F0F] italic">Inscription</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B38B59] font-bold italic">ROOMBOOK Expérience</p>
          </div>

          {!userType ? (
            <div className="space-y-6 animate-in fade-in duration-700">
              <p className="text-center text-[11px] uppercase tracking-widest opacity-60">Quel est votre profil ?</p>
              <button onClick={() => setUserType('client')} className="w-full group border border-[#0F0F0F]/10 p-8 text-left hover:border-[#B38B59] transition-all hover:bg-[#0F0F0F]">
                <h3 className="font-serif text-xl group-hover:text-[#B38B59] italic">Je cherche une salle</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1 group-hover:text-white/60">Client</p>
              </button>
              <button onClick={() => setUserType('owner')} className="w-full group border border-[#0F0F0F]/10 p-8 text-left hover:border-[#B38B59] transition-all hover:bg-[#0F0F0F]">
                <h3 className="font-serif text-xl group-hover:text-[#B38B59] italic">Je propose un espace</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1 group-hover:text-white/60">Propriétaire</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in zoom-in-95 duration-500">

              {/* Message succès */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-green-700 text-[10px] font-bold uppercase tracking-widest">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Message erreur */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Nom complet</label>
                <input name="name" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" placeholder="Votre nom complet" />
              </div>

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Nom d'utilisateur</label>
                <input name="username" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" placeholder="Votre nom d'utilisateur" />
              </div>

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Mot de passe</label>
                <input name="password" type="password" required onChange={handleInputChange} className="bg-transparent outline-none" />
              </div>

              <div className="pt-6 space-y-4">
                <button type="submit" disabled={loading} className="w-full bg-[#0F0F0F] text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#B38B59] transition-all">
                  {loading ? "Chargement..." : `S'inscrire en tant que ${userType === 'owner' ? 'Hôte' : 'Client'}`}
                </button>
                <button type="button" onClick={() => setUserType(null)} className="w-full text-[9px] uppercase opacity-40 hover:opacity-100">
                  ← Retour
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-stone-100 text-center text-[10px] uppercase tracking-widest opacity-40">
            Déjà inscrit ? <Link to="/login" className="text-[#B38B59] font-bold hover:underline">Se connecter</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
