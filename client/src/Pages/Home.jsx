import { useState } from "react";
import { Link } from "react-router-dom";

// --- DONNÉES ---
const WILAYAS = [
  "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar", "09 Blida", "10 Bouira", "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger", "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma", "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla", "31 Oran", "32 El Bayadh", "33 Illizi", "34 Bordj Bou Arreridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued", "40 Khenchela", "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", "47 Ghardaïa", "48 Relizane", "49 El M'Ghair", "50 El Meniaa", "51 Ouled Djellal", "52 Bordj Baji Mokhtar", "53 Béni Abbès", "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
];

const SALLES_MOCK = [
  { 
    id: 1, 
    nom: "Le Palais des Ambassadeurs", 
    wilaya: "16 Alger", 
    type: "Mariage Royal", 
    prix: "350 000", 
    capacite: "500",
    service: "Service complet + Traiteur",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200" 
  },
  { 
    id: 2, 
    nom: "Résidence du Souvenir", 
    wilaya: "15 Tizi Ouzou", 
    type: "Deuil & Funérailles", 
    prix: "85 000", 
    capacite: "250",
    service: "Discrétion & Accompagnement",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1200" 
  }
];

export default function Home() {
  const [showWilayas, setShowWilayas] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState("Toute l'Algérie");

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1E12] font-serif overflow-x-hidden">
      
      {/* --- NAVBAR ÉPURÉE --- */}
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-10 text-white">
        <div className="text-2xl md:text-3xl tracking-[0.3em] font-light uppercase">
          Réserve <span className="text-[#D4AF37] font-bold">d’Or</span>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.4em] font-semibold">
          <Link to="/" className="hover:text-[#D4AF37] transition duration-500">Accueil</Link>
          <Link to="/about" className="hover:text-[#D4AF37] transition duration-500">À Propos</Link>
          <Link to="/login" className="hover:text-[#D4AF37] transition duration-500">Se Connecter</Link>
        </div>
      </nav>

      {/* --- HERO SECTION (L'ancienne photo que tu aimes) --- */}
      <header className="relative h-screen flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Réception Prestige"
        />
        {/* Overlay dégradé marron chocolat vers le bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E12]/70 via-transparent to-[#FAF7F2]"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[#D4AF37] text-[10px] md:text-xs uppercase tracking-[0.6em] mb-6">L'excellence au service de vos émotions</p>
          <h1 className="text-5xl md:text-9xl font-extralight italic leading-tight mb-8">
            Réserve d'Or
          </h1>
        </div>
      </header>

      {/* --- SECTION CATALOGUE --- */}
      <main className="max-w-7xl mx-auto py-32 px-10 mb-32">
        <div className="flex flex-col items-center mb-24">
            <h2 className="text-3xl md:text-5xl font-light italic text-[#3D2B1F]">Le Catalogue Privé</h2>
            <div className="h-[1px] w-24 bg-[#A67C00] mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-20 md:gap-32">
          {SALLES_MOCK.map(salle => (
            <div key={salle.id} className="group cursor-pointer">
              <div className="overflow-hidden aspect-[4/5] bg-stone-200 shadow-2xl relative rounded-sm">
                <img 
                  src={salle.image} 
                  alt={salle.nom} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110" 
                />
                <div className="absolute top-6 right-6 bg-white/90 px-4 py-2 text-[9px] uppercase tracking-widest font-bold shadow-sm">
                  {salle.type}
                </div>
              </div>
              
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-end border-b border-[#3D2B1F]/10 pb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-light text-[#3D2B1F] tracking-tight">{salle.nom}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A67C00] font-bold mt-2 italic">📍 {salle.wilaya}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-light text-[#3D2B1F]">{salle.prix} DA</p>
                    <p className="text-[9px] text-stone-400 uppercase tracking-tighter">Estimation</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500 font-sans italic">
                  <span>Capacité : {salle.capacite} Convives</span>
                  <span>{salle.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- BARRE DES WILAYAS INTERACTIVE (DROPDOWN VERS LE HAUT) --- */}
      <div className="fixed bottom-0 w-full z-[100] flex flex-col items-center">
        
        {/* Liste des Wilayas (s'affiche au clic) */}
        {showWilayas && (
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-t-3xl p-10 border-t border-[#A67C00]/30 animate-in fade-in slide-in-from-bottom-10 duration-500 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A67C00]">Choisissez votre territoire</span>
                <button onClick={() => setShowWilayas(false)} className="text-stone-400 hover:text-black">✕</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              {WILAYAS.map(w => (
                <button 
                  key={w} 
                  onClick={() => { setSelectedWilaya(w); setShowWilayas(false); }}
                  className="text-[11px] uppercase tracking-widest text-left py-2 hover:text-[#A67C00] transition-colors border-b border-transparent hover:border-[#A67C00]/20"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barre Marron Chocolat & Or */}
        <div className="w-full bg-[#2C1E12] text-white py-8 px-8 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-[#A67C00]/20">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">Localisation</span>
                <button 
                  onClick={() => setShowWilayas(!showWilayas)}
                  className="text-lg md:text-xl font-light italic border-b border-[#D4AF37]/40 pb-1 flex items-center gap-6 hover:text-[#D4AF37] transition duration-500"
                >
                  {selectedWilaya} <span className={`text-[10px] transition-transform ${showWilayas ? 'rotate-180' : ''}`}>▼</span>
                </button>
            </div>
          </div>
          
          <button className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-14 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-[#2C1E12] transition-all duration-700 shadow-lg">
            Rechercher dans la Réserve
          </button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1A1A1A] text-white py-32 px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20 opacity-50">
          <div className="max-w-xs text-[10px] uppercase tracking-[0.2em] leading-loose">
            <p className="text-xl tracking-[0.5em] mb-6 font-light">RÉSERVE D'OR</p>
            <p>Le privilège de l'élégance pour chaque étape de la vie. Conciergerie privée opérant sur les 58 wilayas.</p>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold space-y-4">
             <p>© 2026 - L'Excellence Algérienne</p>
             <p>Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}