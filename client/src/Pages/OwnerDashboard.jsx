import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRooms: 0, totalBookings: 0, totalRevenue: 0 });
  const [position, setPosition] = useState({ lat: 36.737, lng: 3.088 });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Propriétaire";
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchRooms(), fetchStats()]);
    setLoading(false);
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/owner/salles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setMyRooms(data);
    } catch (err) { console.error("Erreur salles:", err); }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/owner/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setStats(data);
    } catch (err) { console.error("Erreur stats:", err); }
  };

 
  const handleDelete = async (roomId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.")) {
      try {
        const response = await fetch(`${API_URL}/owner/salles/${roomId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
        
          setMyRooms(myRooms.filter(room => room.id !== roomId));
          fetchStats(); // Pour mettre à jour le compteur de salles
        } else {
          alert("Erreur lors de la suppression.");
        }
      } catch (err) {
        console.error("Erreur suppression:", err);
        alert("Impossible de contacter le serveur.");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  function LocationMarker() {
    useMapEvents({ click(e) { setPosition(e.latlng); } });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    formData.append("types", JSON.stringify(selectedTypes));
    selectedFiles.forEach((file) => formData.append("photos", file));

    try {
      const url = editingRoom ? `${API_URL}/owner/salles/${editingRoom.id}` : `${API_URL}/owner/salles`;
      const response = await fetch(url, {
        method: editingRoom ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData 
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
        setPreviews([]);
        setSelectedFiles([]);
        setEditingRoom(null);
      }
    } catch (err) { alert("Erreur serveur."); }
  };

  const openEditModal = (room = null) => {
    setEditingRoom(room);
    setSelectedTypes(room?.types || []);
    setPosition(room ? { lat: room.latitude, lng: room.longitude } : { lat: 36.737, lng: 3.088 });
    setPreviews(room?.img ? [`${API_URL}${room.img}`] : []);
    setIsModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center italic">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#0F0F0F] pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName={userName} onOpenSettings={() => setIsSettingsOpen(true)} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

        <div className="flex justify-between items-end mb-12 mt-10">
          <h1 className="text-4xl font-serif italic">Espace Business</h1>
          <button onClick={() => openEditModal()} className="bg-[#0F0F0F] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59] transition-all">
            + Publier une salle
          </button>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2 font-bold">Établissements</p>
            <p className="text-3xl font-serif italic">{stats.totalRooms}</p>
          </div>
          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2 font-bold">Réservations Totales</p>
            <p className="text-3xl font-serif italic">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2 font-bold">Revenus (DA)</p>
            <p className="text-3xl font-serif italic text-[#B38B59]">{stats.totalRevenue.toLocaleString()} DA</p>
          </div>
        </div>

     
        <section className="space-y-8">
          <h2 className="text-xl font-serif italic border-b pb-2 mb-6">Vos Établissements</h2>
          {myRooms.length === 0 && <p className="italic text-stone-400">Aucune salle publiée.</p>}
          {myRooms.map(room => (
            <div key={room.id} className="bg-white border border-stone-200 flex flex-col md:flex-row shadow-sm">
              <img src={room.img ? `${API_URL}${room.img}` : "https://via.placeholder.com/300"} className="md:w-64 h-48 object-cover" alt={room.nom} />
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-serif">{room.nom}</h3>
                  <div className="flex gap-4">
                    <button onClick={() => openEditModal(room)} className="text-[9px] font-bold uppercase border-b border-black">Modifier</button>
                 
                    <button onClick={() => handleDelete(room.id)} className="text-[9px] font-bold uppercase text-red-600 hover:text-red-800 transition-colors">Supprimer</button>
                  </div>
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

      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-10 overflow-y-auto max-h-[90vh] shadow-2xl relative">
            <h2 className="text-2xl font-serif italic mb-10">{editingRoom ? "Modifier" : "Nouveau Référencement"}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
            
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-grow bg-[#0F0F0F] text-white py-5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59]">Sauvegarder</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 border border-black text-[10px] uppercase font-bold">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}