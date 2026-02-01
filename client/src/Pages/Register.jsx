import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'client' or 'owner'
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    wilaya: "",
    password: ""
  });

  const wilayas = [
    "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar", "09 Blida", "10 Bouira",
    "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger", "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda",
    "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma", "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla",
    "31 Oran", "32 El Bayadh", "33 Illizi", "34 Bordj Bou Arréridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued", "40 Khenchela",
    "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", "47 Ghardaïa", "48 Relizane", "49 El M'Ghair", "50 El Meniaa",
    "51 Ouled Djellal", "52 Bordj Baji Mokhtar", "53 Béni Abbès", "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation Email simple
    if (!formData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    // Validation Wilaya (si propriétaire)
    if (userType === "owner" && !formData.wilaya) {
      setError("Veuillez sélectionner une Wilaya.");
      return;
    }

    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    console.log("Inscription réussie :", formData);
    alert("Compte créé avec succès !");
    navigate("/login");
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
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b border-stone-200 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Prénom</label>
                  <input name="firstname" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" />
                </div>
                <div className="flex flex-col border-b border-stone-200 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Nom</label>
                  <input name="lastname" type="text" required onChange={handleInputChange} className="bg-transparent outline-none italic" />
                </div>
              </div>

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Email</label>
                <input name="email" type="email" required onChange={handleInputChange} className="bg-transparent outline-none italic" />
              </div>

              {userType === 'owner' && (
                <div className="flex flex-col border-b border-stone-200 py-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Wilaya de l'espace</label>
                  <select name="wilaya" required onChange={handleInputChange} className="bg-transparent outline-none text-sm italic">
                    <option value="">Choisir la wilaya</option>
                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              )}

              <div className="flex flex-col border-b border-stone-200 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Mot de passe</label>
                <input name="password" type="password" required onChange={handleInputChange} className="bg-transparent outline-none" />
              </div>

              <div className="pt-6 space-y-4">
                <button type="submit" className="w-full bg-[#0F0F0F] text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#B38B59] transition-all">
                  S'inscrire en tant que {userType === 'owner' ? 'Hôte' : 'Client'}
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