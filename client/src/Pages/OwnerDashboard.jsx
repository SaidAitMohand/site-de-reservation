import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correction des icônes Leaflet pour React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function OwnerDashboard() {
  const navigate = useNavigate();

  // --- ÉTATS (STATES) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ lat: 36.737, lng: 3.088 });
  const [replyText, setReplyText] = useState({ reviewId: null, text: "" });

  // --- AUTHENTIFICATION ---
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "KABICHE Karine";

  const eventOptions = ["Mariage", "Conférence", "Anniversaire", "Shooting", "Dîner", "Séminaire"];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchRooms();
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- APPELS API ---
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:3000/owner/salles", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.status === 401) handleLogout();
      const data = await response.json();
      if (response.ok) setMyRooms(data);
    } catch (err) {
      console.error("Erreur chargement salles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = {
      nom: formData.get("nom"),
      prix: formData.get("prix"),
      capacite: formData.get("capacite"),
      description: formData.get("description"),
      types: JSON.stringify(selectedTypes),
      img: previews[0] || "",
      latitude: position.lat,
      longitude: position.lng
    };

    try {
      const url = editingRoom 
        ? `http://localhost:3000/owner/salles/${editingRoom.id}` 
        : "http://localhost:3000/owner/salles";
      
      const response = await fetch(url, {
        method: editingRoom ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      alert("Erreur de connexion serveur");
    }
  };

  // --- LOGIQUE CARTE ---
  function LocationMarker() {
    useMapEvents({
      click(e) { setPosition(e.latlng); },
    });
    return <Marker position={position} />;
  }

  const openEditModal = (room = null) => {
    setEditingRoom(room);
    setPreviews(room ? [room.img] : []);
    setSelectedTypes(room ? (room.types || []) : []);
    setPosition(room ? { lat: room.latitude, lng: room.longitude } : { lat: 36.737, lng: 3.088 });
    setIsModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center italic bg-[#F9F6F2]">Initialisation de votre session...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20 text-[#0F0F0F]">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName={userName} onOpenSettings={() => setIsSettingsOpen(true)} onLogout={handleLogout} />

        <div className="flex justify-between items-end mb-16 mt-10">
          <div>
            <h1 className="text-4xl font-serif italic">Espace Business</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#B38B59] mt-2 font-bold">Bienvenue, {userName}</p>
          </div>
          <button onClick={() => openEditModal()} className="bg-[#0F0F0F] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59] transition-all">+ Publier une salle</button>
        </div>

        {/* --- STATISTIQUES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Portfolio</p>
            <p className="text-3xl font-serif italic">{myRooms.length} Établissements</p>
          </div>
          <div className="bg-white p-8 border border-stone-200">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Réservations</p>
            <p className="text-3xl font-serif italic text-[#B38B59]">12</p>
          </div>
          <div className="bg-white p-8 border border-stone-200">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Revenus</p>
            <p className="text-3xl font-serif italic">Calcul en cours...</p>
          </div>
        </div>

        {/* --- TABLEAU DE SUIVI DES DEMANDES --- */}
        <section className="mb-20">
          <h2 className="text-xl font-serif italic mb-6 border-b border-stone-200 pb-2">Suivi des Demandes & RDV</h2>
          <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0F0F0F] text-white text-[9px] uppercase tracking-widest">
                <tr>
                  <th className="p-6">Date & Heure</th>
                  <th className="p-6">Espace</th>
                  <th className="p-6">Client</th>
                  <th className="p-6 text-center">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 italic">
                {myRooms.flatMap(room => (room.bookings || []).map(b => (
                  <tr key={b.id} className="text-xs hover:bg-stone-50">
                    <td className="p-6 font-bold not-italic">{b.date} <span className="opacity-40 ml-2">{b.time}</span></td>
                    <td className="p-6 font-bold text-[#B38B59] uppercase not-italic">{room.nom}</td>
                    <td className="p-6">{b.client}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-bold uppercase not-italic ${b.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{b.status}</span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- LISTE DES SALLES --- */}
        <section className="space-y-12">
          <h2 className="text-xl font-serif italic mb-6 border-b border-stone-200 pb-2">Vos Établissements</h2>
          {myRooms.map(room => (
            <div key={room.id} className="bg-white border border-stone-200 overflow-hidden shadow-sm group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-80 h-64 overflow-hidden relative bg-stone-100">
                  <img src={room.img || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-serif">{room.nom}</h3>
                    <div className="flex gap-4">
                      <button onClick={() => openEditModal(room)} className="text-[9px] font-bold uppercase border-b border-black">Modifier</button>
                      <button className="text-[9px] font-bold uppercase text-red-500">Désactiver</button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 italic line-clamp-2">{room.description}</p>
                  <div className="flex gap-8 mt-10 border-t pt-6">
                    <div><span className="block text-[8px] uppercase opacity-40">Tarif</span><span className="text-lg font-serif italic text-[#B38B59]">{room.prix} DA</span></div>
                    <div><span className="block text-[8px] uppercase opacity-40">Capacité</span><span className="text-lg font-serif italic">{room.capacite} pers.</span></div>
                    <div><span className="block text-[8px] uppercase opacity-40">Position</span><span className="text-[10px] italic">{room.latitude?.toFixed(2)}, {room.longitude?.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* --- MODAL AJOUT/EDITION AVEC CARTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-12 overflow-y-auto max-h-[90vh] relative shadow-2xl">
            <h2 className="text-2xl font-serif italic mb-10 text-[#0F0F0F]">{editingRoom ? "Editer l'établissement" : "Nouveau Référencement"}</h2>
            
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Nom commercial</label>
                  <input name="nom" type="text" defaultValue={editingRoom?.nom} className="bg-transparent outline-none italic text-lg" required />
                </div>
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Capacité maximale</label>
                  <input name="capacite" type="number" defaultValue={editingRoom?.capacite} className="bg-transparent outline-none font-bold text-lg" required />
                </div>
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Tarif Journalier (DA)</label>
                  <input name="prix" type="number" defaultValue={editingRoom?.prix} className="bg-transparent outline-none font-bold text-lg" required />
                </div>
              </div>

              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Description & Services</label>
                <textarea name="description" rows="2" defaultValue={editingRoom?.description} className="bg-transparent outline-none text-sm py-2 italic resize-none" required />
              </div>

              {/* SECTION CARTE */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Géo-localisation (Cliquez sur la carte)</label>
                <div className="h-64 w-full border border-stone-300 z-0">
                  <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Types d'événements</label>
                <div className="flex flex-wrap gap-2">
                  {eventOptions.map(t => (
                    <button key={t} type="button" onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                      className={`px-4 py-2 text-[8px] uppercase font-bold border transition-colors ${selectedTypes.includes(t) ? "bg-black text-white" : "border-stone-300"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-grow bg-[#0F0F0F] text-white py-5 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[#B38B59] transition-all">
                  {editingRoom ? "Sauvegarder les modifications" : "Publier maintenant"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 border border-black text-[10px] uppercase font-bold">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL PARAMÈTRES --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F0F0F]/95 backdrop-blur-md p-4">
          <div className="bg-[#F9F6F2] w-full max-w-md p-10 relative">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 opacity-30 hover:opacity-100">✕</button>
            <h2 className="text-xl font-serif italic mb-8">Compte & Sécurité</h2>
            <div className="space-y-5">
              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-red-600">Déconnexion sécurisée</button>
              <button onClick={() => setIsSettingsOpen(false)} className="w-full border border-black py-4 text-[10px] uppercase font-bold">Retour</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}