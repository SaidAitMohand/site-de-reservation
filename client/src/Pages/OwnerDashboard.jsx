import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour les icônes de marqueurs Leaflet
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
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Localisation
  const [position, setPosition] = useState({ lat: 36.737, lng: 3.088 });
  
  // Images
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  // Types
  const [selectedTypes, setSelectedTypes] = useState([]);

  // --- AUTHENTIFICATION ---
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Utilisateur";
  const eventOptions = ["Mariage", "Conférence", "Anniversaire", "Shooting", "Dîner", "Séminaire"];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchRooms();
    }
  }, [token]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:3000/owner/salles", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
      const data = await response.json();
      if (response.ok) setMyRooms(data);
    } catch (err) {
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- GESTION DES IMAGES ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  // --- LOGIQUE CARTE ---
  function LocationMarker() {
    useMapEvents({
      click(e) { setPosition(e.latlng); },
    });
    return <Marker position={position} />;
  }

  function MapViewFix({ center }) {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.setView([center.lat, center.lng]);
        map.invalidateSize();
      }, 300);
    }, [center, map]);
    return null;
  }

  // --- SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Récupère Nom, Prix, Capacité, Description automatiquement

    // Ajout manuel des données complexes
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    formData.append("types", JSON.stringify(selectedTypes));

    // Ajout des fichiers
    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const url = editingRoom 
        ? `http://localhost:3000/owner/salles/${editingRoom.id}` 
        : "http://localhost:3000/owner/salles";

      const response = await fetch(url, {
        method: editingRoom ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData // On envoie le FormData (ne pas mettre de Content-Type JSON)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchRooms();
        // Reset des états
        setPreviews([]);
        setSelectedFiles([]);
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  const openEditModal = (room = null) => {
    setEditingRoom(room);
    setSelectedTypes(room?.types || []);
    setPosition(room ? { lat: room.latitude, lng: room.longitude } : { lat: 36.737, lng: 3.088 });
    setPreviews(room?.img ? [room.img] : []);
    setIsModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center italic">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#0F0F0F] pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName={userName} onOpenSettings={() => setIsSettingsOpen(true)} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

        <div className="flex justify-between items-end mb-16 mt-10">
          <div>
            <h1 className="text-4xl font-serif italic">Espace Business</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#B38B59] mt-2 font-bold">Bienvenue, {userName}</p>
          </div>
          <button onClick={() => openEditModal()} className="bg-[#0F0F0F] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59] transition-all">
            + Publier une salle
          </button>
        </div>

        {/* --- LISTE DES SALLES --- */}
        <section className="space-y-8">
          <h2 className="text-xl font-serif italic border-b pb-2 mb-6">Vos Établissements</h2>
          {myRooms.map(room => (
            <div key={room.id} className="bg-white border border-stone-200 flex flex-col md:flex-row shadow-sm">
              <img src={room.img || "https://via.placeholder.com/300"} className="md:w-64 h-48 object-cover" alt="" />
              <div className="p-6 flex-grow">
                <div className="flex justify-between">
                  <h3 className="text-2xl font-serif">{room.nom}</h3>
                  <button onClick={() => openEditModal(room)} className="text-[9px] font-bold uppercase border-b border-black">Modifier</button>
                </div>
                <p className="text-xs text-stone-500 mt-2 italic line-clamp-2">{room.description}</p>
                <div className="flex gap-8 mt-6 border-t pt-4">
                  <div><span className="block text-[8px] uppercase opacity-40">Tarif</span><span className="text-lg font-serif italic text-[#B38B59]">{room.prix} DA</span></div>
                  <div><span className="block text-[8px] uppercase opacity-40">Capacité</span><span className="text-lg font-serif italic">{room.capacite} pers.</span></div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* --- MODAL AJOUT / ÉDITION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-10 overflow-y-auto max-h-[90vh] shadow-2xl relative">
            <h2 className="text-2xl font-serif italic mb-10">{editingRoom ? "Modifier l'espace" : "Nouveau Référencement"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Infos de base */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Nom commercial</label>
                  <input name="nom" defaultValue={editingRoom?.nom} className="bg-transparent outline-none italic text-lg" required />
                </div>
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Tarif (DA)</label>
                  <input name="prix" type="number" defaultValue={editingRoom?.prix} className="bg-transparent outline-none font-bold text-lg" required />
                </div>
                <div className="flex flex-col border-b border-stone-300 py-2">
                  <label className="text-[9px] uppercase font-bold opacity-40">Capacité</label>
                  <input name="capacite" type="number" defaultValue={editingRoom?.capacite} className="bg-transparent outline-none font-bold text-lg" required />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Galerie Photos</label>
                <div className="flex flex-wrap gap-4">
                  <label className="w-24 h-24 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:border-black">
                    <span className="text-xl">+</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {previews.map((src, i) => (
                    <img key={i} src={src} className="w-24 h-24 object-cover border border-stone-200" alt="preview" />
                  ))}
                </div>
              </div>

              {/* Carte */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Localisation (Cliquez sur la carte)</label>
                <div className="h-64 w-full border border-stone-300">
                  <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                    <MapViewFix center={position} />
                  </MapContainer>
                </div>
              </div>

              {/* Types d'événements */}
              <div className="flex flex-wrap gap-2">
                {eventOptions.map(t => (
                  <button 
                    key={t} 
                    type="button" 
                    onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    className={`px-4 py-2 text-[8px] uppercase font-bold border transition-all ${selectedTypes.includes(t) ? "bg-black text-white" : "border-stone-300"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-grow bg-[#0F0F0F] text-white py-5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59]">Enregistrer les données</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 border border-black text-[10px] uppercase font-bold">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}