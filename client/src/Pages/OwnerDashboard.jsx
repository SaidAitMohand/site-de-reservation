import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correction des icônes Leaflet par défaut
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
  const [editingRoom, setEditingRoom] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRooms: 0, totalBookings: 0, totalRevenue: 0 });
  
  // États du formulaire
  const [position, setPosition] = useState({ lat: 36.737, lng: 3.088 }); // Alger par défaut
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Propriétaire";
  const API_URL = "http://localhost:3000";

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchRooms(), fetchStats()]);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    const res = await fetch(`${API_URL}/owner/salles`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setMyRooms(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/owner/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setStats(data);
  };

  // --- ACTIONS ---
  const handleDelete = async (roomId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet établissement ?")) {
      const res = await fetch(`${API_URL}/owner/salles/${roomId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMyRooms(myRooms.filter(r => r.id !== roomId));
        fetchStats();
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    selectedFiles.forEach(file => formData.append("photos", file));

    const url = editingRoom ? `${API_URL}/owner/salles/${editingRoom.id}` : `${API_URL}/owner/salles`;
    const method = editingRoom ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingRoom(null);
        setSelectedFiles([]);
        setPreviews([]);
        fetchData();
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const openEditModal = (room = null) => {
    setEditingRoom(room);
    if (room) {
      setPosition({ lat: room.latitude, lng: room.longitude });
      setPreviews(room.img ? [`${API_URL}${room.img}`] : []);
    } else {
      setPosition({ lat: 36.737, lng: 3.088 });
      setPreviews([]);
    }
    setIsModalOpen(true);
  };

  // --- COMPOSANTS DE LA CARTE ---
  function LocationMarker() {
    useMapEvents({
      click(e) { setPosition(e.latlng); }
    });
    return <Marker position={position} />;
  }

  function MapUpdate({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView([center.lat, center.lng]);
      map.invalidateSize();
    }, [center, map]);
    return null;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-stone-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#0F0F0F] pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName={userName} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

        {/* Header Dashboard */}
        <div className="flex justify-between items-end mb-12 mt-10">
          <div>
            <h1 className="text-4xl font-serif italic">Espace Business</h1>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-2">Gestion de vos établissements</p>
          </div>
          <button onClick={() => openEditModal()} className="bg-[#0F0F0F] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59] transition-all shadow-lg">
            + Publier une salle
          </button>
        </div>

        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard label="Établissements" value={stats.totalRooms} />
          <StatCard label="Réservations" value={stats.totalBookings} />
          <StatCard label="Revenus Total" value={`${stats.totalRevenue?.toLocaleString()} DA`} highlight />
        </div>

        {/* Liste des Salles */}
        <section className="space-y-6">
          <h2 className="text-xl font-serif italic border-b border-stone-200 pb-2 mb-8">Vos Biens</h2>
          {myRooms.length === 0 && <p className="italic text-stone-400 text-center py-20 bg-white border border-dashed border-stone-300">Aucune salle publiée pour le moment.</p>}
          
          {myRooms.map(room => (
            <div key={room.id} className="bg-white border border-stone-200 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow group">
              <img src={room.img ? `${API_URL}${room.img}` : "https://via.placeholder.com/400x300?text=Pas+d'image"} className="md:w-72 h-52 object-cover" alt={room.nom} />
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif">{room.nom}</h3>
                    <p className="text-xs text-stone-400 mt-1 italic">{room.description?.substring(0, 100)}...</p>
                  </div>
                  <div className="flex gap-5">
                    <button onClick={() => openEditModal(room)} className="text-[9px] font-bold uppercase border-b border-black pb-1">Modifier</button>
                    <button onClick={() => handleDelete(room.id)} className="text-[9px] font-bold uppercase text-red-600 border-b border-red-600 pb-1">Supprimer</button>
                  </div>
                </div>
                <div className="flex gap-12 mt-8 pt-6 border-t border-stone-100">
                  <InfoMini label="Tarif Journalier" value={`${room.prix} DA`} gold />
                  <InfoMini label="Capacité" value={`${room.capacite} pers.`} />
                  <InfoMini label="Localisation" value="GPS Actif" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* --- MODALE D'AJOUT / MODIFICATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-5xl p-10 overflow-y-auto max-h-[95vh] shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-8 text-2xl hover:rotate-90 transition-transform">✕</button>
            <h2 className="text-3xl font-serif italic mb-10">{editingRoom ? "Modifier l'établissement" : "Nouveau Référencement"}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Colonne Gauche : Textes */}
              <div className="space-y-6">
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Nom de la salle</label>
                  <input name="nom" defaultValue={editingRoom?.nom} required className="bg-transparent outline-none italic text-lg" placeholder="Ex: Palais des Roses" />
                </div>
                
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Description</label>
                  <textarea name="description" defaultValue={editingRoom?.description} rows="3" required className="bg-transparent outline-none italic text-sm resize-none" placeholder="Décrivez le prestige de votre lieu..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col border-b border-stone-300 py-2">
                    <label className="text-[9px] uppercase font-bold opacity-40">Prix (DA / jour)</label>
                    <input name="prix" type="number" defaultValue={editingRoom?.prix} required className="bg-transparent outline-none font-bold text-lg" />
                  </div>
                  <div className="flex flex-col border-b border-stone-300 py-2">
                    <label className="text-[9px] uppercase font-bold opacity-40">Capacité (personnes)</label>
                    <input name="capacite" type="number" defaultValue={editingRoom?.capacite} required className="bg-transparent outline-none font-bold text-lg" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-[9px] uppercase font-bold opacity-40">Photos de l'établissement</label>
                  <input type="file" multiple onChange={handleImageChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-black file:text-white" />
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {previews.map((src, i) => <img key={i} src={src} className="w-20 h-20 object-cover border border-stone-300" alt="Preview" />)}
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Carte */}
              <div className="flex flex-col">
                <label className="text-[9px] uppercase font-bold opacity-40 mb-3">Localisation précise (Cliquez sur la carte)</label>
                <div className="h-[350px] w-full border border-stone-300">
                  <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                    <MapUpdate center={position} />
                  </MapContainer>
                </div>
                <p className="text-[8px] mt-2 italic text-stone-400 text-right">Lat: {position.lat.toFixed(4)} | Lng: {position.lng.toFixed(4)}</p>
                
                <div className="mt-auto flex gap-4 pt-10">
                  <button type="submit" className="flex-grow bg-[#0F0F0F] text-white py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#B38B59] transition-all">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PETITS COMPOSANTS INTERNES ---
function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white p-8 border border-stone-200 shadow-sm">
      <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2 font-bold">{label}</p>
      <p className={`text-3xl font-serif italic ${highlight ? 'text-[#B38B59]' : ''}`}>{value}</p>
    </div>
  );
}

function InfoMini({ label, value, gold }) {
  return (
    <div>
      <span className="block text-[8px] uppercase opacity-40 font-bold tracking-tighter">{label}</span>
      <span className={`text-lg font-serif italic ${gold ? 'text-[#B38B59]' : ''}`}>{value}</span>
    </div>
  );
}