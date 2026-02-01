import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const WILAYAS = [
  "01 Adrar", "06 Béjaïa", "15 Tizi Ouzou", "16 Alger", "19 Sétif", "23 Annaba", "25 Constantine", "31 Oran"
];

const EVENT_TYPES = [
  "Séminaire & Conférence", "Lancement de Produit", "Exposition d'Art", "Dîner de Gala", "Shooting & Tournage", "Réception Privée"
];

const FEATURED_ROOMS = [
  { id: 1, name: "Le Loft Industriel", location: "Alger, Hydra", price: "85 000", type: "Shooting / Event", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Villa Méditerranéenne", location: "Oran, Canastel", price: "120 000", type: "Réception Privée", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Le Cube Business", location: "Constantine", price: "45 000", type: "Séminaire", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" }
];

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#1A1A1A] font-light overflow-x-hidden selection:bg-[#B38B59] selection:text-white">
      <Navbar />

      {/* --- RECHERCHE LATÉRALE --- */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#0F0F0F] text-white z-[200] shadow-2xl transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSearchOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-12 md:p-16 h-full flex flex-col relative">
          
          <button 
            onClick={() => setIsSearchOpen(false)} 
            className="self-end flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[#B38B59] hover:text-white transition-all group"
          >
            Fermer <span className="text-2xl font-light group-hover:rotate-90 transition-transform inline-block">✕</span>
          </button>
          
          <div className="mt-12 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-4xl font-serif italic mb-2">Filtrer les lieux</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#B38B59] mb-12 border-b border-[#B38B59]/20 pb-4">Configurez votre recherche</p>
            
            <div className="space-y-10">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-[0.3em] text-[#B38B59] mb-3 font-bold">Nature de l'événement</label>
                <select className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#B38B59] transition italic text-lg text-white appearance-none cursor-pointer">
                  <option className="text-black">Tous types d'événements</option>
                  {EVENT_TYPES.map(t => <option key={t} className="text-black">{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-[0.3em] text-[#B38B59] mb-3 font-bold">Wilaya</label>
                <select className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#B38B59] transition italic text-lg text-white appearance-none cursor-pointer">
                  {WILAYAS.map(w => <option key={w} className="text-black">{w}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-[0.3em] text-[#B38B59] font-bold">Budget journalier (DA)</label>
                <div className="flex gap-4">
                  <input type="number" placeholder="Min" className="w-1/2 bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B38B59] text-white placeholder:text-white/20" />
                  <input type="number" placeholder="Max" className="w-1/2 bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B38B59] text-white placeholder:text-white/20" />
                </div>
              </div>
            </div>

            <button className="w-full mt-16 bg-[#B38B59] text-[#1A1A1A] py-6 text-[11px] uppercase tracking-[0.4em] font-extrabold hover:bg-white transition-all shadow-xl">
              Explorer les espaces
            </button>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center px-8 md:px-20 pt-24">
        <div className="grid md:grid-cols-2 w-full items-center gap-16">
          <div className="z-10 order-2 md:order-1">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-[#B38B59]"></span>
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#B38B59] font-bold">Premium Event Spaces</span>
            </div>
            <h1 className="text-6xl md:text-[85px] font-serif leading-[1.1] mb-10 text-[#0F0F0F]">
              Réservez <span className="italic text-[#B38B59]">l'espace</span>,<br/>
              signez <span className="italic">l'exception</span>.
            </h1>
            <p className="max-w-md text-[#1A1A1A]/70 leading-relaxed mb-12 text-lg italic">
              "L'adresse idéale pour vos moments marquants, de la salle de conférence moderne au jardin privé d'exception."
            </p>
            
            <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-6 group bg-[#0F0F0F] hover:bg-[#B38B59] text-white pr-10 transition-all duration-500 shadow-2xl">
              <span className="bg-white/10 p-6 group-hover:bg-black/20 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <span className="text-[11px] uppercase tracking-[0.5em] font-bold">Lancer la recherche</span>
            </button>
          </div>
          
          <div className="relative h-[55vh] md:h-[80vh] w-full order-1 md:order-2">
            <div className="absolute -inset-4 border border-[#B38B59]/30 translate-x-8 translate-y-8 z-0"></div>
            <div className="relative h-full w-full overflow-hidden z-10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-[3s]" alt="Architecture" />
            </div>
          </div>
        </div>
      </header>

      {/* --- SECTION CATALOGUE --- */}
      <section className="py-32 px-8 md:px-20 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-[#1A1A1A]/10 pb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#B38B59] font-bold">Sélection 2026</span>
            <h2 className="text-5xl font-serif italic mt-4 text-[#0F0F0F]">Salles à la une</h2>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
          {FEATURED_ROOMS.map((room) => (
            <div key={room.id} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-stone-200 overflow-hidden relative mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                <img src={room.img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]" alt={room.name} />
                <div className="absolute top-6 left-6 bg-[#0F0F0F]/80 backdrop-blur-md text-[#B38B59] text-[8px] uppercase tracking-[0.3em] font-bold px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">Disponible</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-[#1A1A1A]/10 pb-4 group-hover:border-[#B38B59] transition-colors duration-500">
                  <h3 className="text-xl font-serif italic tracking-tight">{room.name}</h3>
                  <p className="text-sm font-bold text-[#B38B59]">{room.price} DA</p>
                </div>
                <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] font-bold opacity-50">
                  <span>📍 {room.location}</span>
                  <span>{room.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}