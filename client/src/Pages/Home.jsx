import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour l'icône de marqueur par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Ajout de coordonnées fictives pour tes salles à la une
const FEATURED_ROOMS = [
  { id: 1, name: "Le Loft Industriel", location: "Alger, Hydra", price: "85 000", type: "Shooting", lat: 36.75, lng: 3.05, img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Villa Méditerranéenne", location: "Oran, Canastel", price: "120 000", type: "Réception", lat: 35.70, lng: -0.63, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Le Cube Business", location: "Constantine", price: "45 000", type: "Séminaire", lat: 36.36, lng: 6.61, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" }
];

export default function Home() {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#1A1A1A] font-light overflow-x-hidden selection:bg-[#B38B59] selection:text-white">
      <Navbar />

      {/* --- OVERLAY DE LA CARTE INTERACTIVE --- */}
      <div className={`fixed inset-0 bg-[#0F0F0F] z-[200] transform transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMapOpen ? "translate-y-0" : "translate-y-full"}`}>
        
        {/* Header de la carte */}
        <div className="absolute top-0 left-0 w-full p-8 z-[210] flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div>
            <h2 className="text-white text-3xl font-serif italic">Exploration Géographique</h2>
            <p className="text-[#B38B59] text-[10px] uppercase tracking-widest">Trouvez l'exception partout en Algérie</p>
          </div>
          <button 
            onClick={() => setIsMapOpen(false)} 
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[#B38B59] hover:text-white transition-all group"
          >
            Fermer la carte <span className="text-2xl font-light group-hover:rotate-90 transition-transform inline-block">✕</span>
          </button>
        </div>

        {/* Conteneur de la Carte */}
        <div className="h-full w-full grayscale-[0.3] invert-[0.05]">
          {isMapOpen && (
            <MapContainer center={[36.75, 3.05]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Style sombre luxe
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {FEATURED_ROOMS.map(room => (
                <Marker key={room.id} position={[room.lat, room.lng]}>
                  <Popup className="custom-popup">
                    <div className="w-48 p-0 font-serif">
                      <img src={room.img} className="w-full h-24 object-cover mb-2" alt={room.name} />
                      <h3 className="font-bold text-lg">{room.name}</h3>
                      <p className="text-[#B38B59] text-sm">{room.price} DA / jour</p>
                      <button className="w-full mt-2 bg-black text-white py-2 text-[10px] uppercase tracking-widest">Voir détails</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* --- HEADER HERO --- */}
      <header className="relative min-h-screen flex items-center px-8 md:px-20 pt-24">
        <div className="grid md:grid-cols-2 w-full items-center gap-16">
          <div className="z-10 order-2 md:order-1">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-[#B38B59]"></span>
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#B38B59] font-bold">Premium Event Spaces</span>
            </div>
            <h1 className="text-6xl md:text-[85px] font-serif leading-[1.1] mb-10 text-[#0F0F0F]">
              Explorez <span className="italic text-[#B38B59]">l'Algérie</span>,<br/>
              trouvez <span className="italic">l'unique</span>.
            </h1>
            
            <button 
              onClick={() => setIsMapOpen(true)} 
              className="flex items-center gap-6 group bg-[#0F0F0F] hover:bg-[#B38B59] text-white pr-10 transition-all duration-500 shadow-2xl"
            >
              <span className="bg-white/10 p-6 group-hover:bg-black/20 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="text-[11px] uppercase tracking-[0.5em] font-bold">Ouvrir la carte interactive</span>
            </button>
          </div>
          
          {/* Image Hero */}
          <div className="relative h-[55vh] md:h-[80vh] w-full order-1 md:order-2">
            <div className="absolute -inset-4 border border-[#B38B59]/30 translate-x-8 translate-y-8 z-0"></div>
            <div className="relative h-full w-full overflow-hidden z-10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Architecture" />
            </div>
          </div>
        </div>
      </header>

      {/* --- SECTION SALLES À LA UNE (Inchangée) --- */}
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
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-serif italic">{room.name}</h3>
                <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] font-bold opacity-50">
                  <span>📍 {room.location}</span>
                  <span>{room.price} DA</span>
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