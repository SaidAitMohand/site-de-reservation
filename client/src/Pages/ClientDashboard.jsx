import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const navigate = useNavigate();
  
  // Récupération des infos de session
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name") || "Client";

  // États pour les données du back
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres et UI
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [bookingData, setBookingData] = useState({
    date_debut: "",
    date_fin: "",
    notes: ""
  });

  const EventOptions = ["Mariage", "Conférence", "Anniversaire", "Shooting", "Dîner", "Séminaire"];

  const wilayas = [
    "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar", "09 Blida", "10 Bouira", 
    "16 Alger", "19 Sétif", "25 Constantine", "31 Oran" // Liste abrégée pour l'exemple
  ];

  // 1. Chargement initial des données
  useEffect(() => {
    if (!token) {
      navigate("/admin-login"); // Ou ta page de login client
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // On récupère les salles (ajusté à ta route admin ou une route publique si tu en crées une)
        const roomsRes = await fetch("http://localhost:4000/admin/salles", { headers });
        const roomsData = await roomsRes.json();

        // On récupère les réservations du client (nécessite la route GET /client/mes-reservations au back)
        const bookingsRes = await fetch("http://localhost:4000/client/mes-reservations", { headers });
        const bookingsData = await bookingsRes.json();

        setRooms(roomsData);
        setMyBookings(bookingsData);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // 2. Soumission d'une réservation réelle
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/reservations/${selectedRoom.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date_debut: bookingData.date_debut,
          date_fin: bookingData.date_fin
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert("Réservation enregistrée !");
        setSelectedRoom(null);
        // On rafraîchit la liste des réservations
        window.location.reload();
      } else {
        alert(result.message || "Erreur lors de la réservation");
      }
    } catch (err) {
      console.error(err);
      alert("Serveur injoignable");
    }
  };

  if (loading) return <div className="p-20 text-center font-serif italic bg-[#F9F6F2] min-h-screen">Chargement de votre espace...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20 text-[#0F0F0F]">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName={userName} />

        {/* SECTION RÉSERVATIONS RÉELLES */}
        <section className="mb-16 mt-10">
          <h2 className="text-xl font-serif italic mb-6 border-b border-stone-200 pb-2">Suivi de mes réservations</h2>
          <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#0F0F0F] text-white text-[9px] uppercase tracking-widest">
                <tr>
                  <th className="p-4">Établissement</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4 text-center">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs italic">
                {myBookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-4">
                        <span className="block font-bold not-italic">{b.salle?.nom || "Salle"}</span>
                        <span className="text-[10px] opacity-50">ID: {b.id}</span>
                    </td>
                    <td className="p-4">Du {new Date(b.date_debut).toLocaleDateString()} au {new Date(b.date_fin).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                       <span className="px-3 py-1 bg-stone-100 rounded-full text-[10px] uppercase font-bold not-italic">En attente</span>
                    </td>
                  </tr>
                ))}
                {myBookings.length === 0 && (
                  <tr><td colSpan="3" className="p-10 text-center opacity-40">Aucune réservation en cours.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FILTRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-white p-8 border border-stone-200 shadow-sm">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold opacity-40 mb-2">Filtrer par Wilaya</label>
            <select value={filterWilaya} onChange={(e) => setFilterWilaya(e.target.value)} className="bg-transparent border-b border-stone-300 py-2 outline-none italic text-sm">
              <option value="">Toute l'Algérie</option>
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold opacity-40 mb-2">Budget Max (DA)</label>
            <input type="number" value={filterBudget} onChange={(e) => setFilterBudget(e.target.value)} className="bg-transparent border-b border-stone-300 py-2 outline-none font-bold text-sm" placeholder="Ex: 60000" />
          </div>
        </div>

        {/* LISTE DES SALLES AJUSTÉE AU BACKEND */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {rooms
            .filter(r => (filterWilaya === "" || r.wilaya === filterWilaya) && (filterBudget === "" || r.prix <= parseInt(filterBudget)))
            .map(room => (
              <div key={room.id} className="bg-white border border-stone-200 group relative">
                <div className="h-56 overflow-hidden relative">
                  {/* Correction du chemin de l'image */}
                  <img src={`http://localhost:4000${room.img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.nom} />
                  <div className="absolute top-4 left-4 bg-[#0F0F0F] text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest">{room.wilaya || "Algérie"}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2">{room.nom}</h3>
                  <p className="text-[#B38B59] font-serif italic">{room.prix} DA <span className="text-[10px] text-stone-400 not-italic uppercase tracking-widest">/ Jour</span></p>
                  <button onClick={() => setSelectedRoom(room)} className="mt-6 w-full border border-black py-4 text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all">Détails & Réserver</button>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* MODAL RÉSERVATION */}
      {selectedRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6 text-xl">✕</button>
            <div className="mb-8 border-b border-stone-200 pb-4">
              <h2 className="text-3xl font-serif italic">{selectedRoom.nom}</h2>
              <p className="text-[10px] uppercase font-bold text-[#B38B59] tracking-widest mt-1">Capacité : {selectedRoom.capacite} personnes</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Date de début</label>
                <input required type="date" value={bookingData.date_debut} onChange={(e) => setBookingData({...bookingData, date_debut: e.target.value})} className="bg-transparent outline-none" />
              </div>
              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Date de fin</label>
                <input required type="date" value={bookingData.date_fin} onChange={(e) => setBookingData({...bookingData, date_fin: e.target.value})} className="bg-transparent outline-none" />
              </div>
              <div className="md:col-span-2 flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Notes pour le propriétaire</label>
                <textarea rows="3" value={bookingData.notes} onChange={(e) => setBookingData({...bookingData, notes: e.target.value})} className="bg-transparent outline-none italic text-sm resize-none" placeholder="Ex: Type d'événement, besoins spécifiques..." />
              </div>
              <button type="submit" className="md:col-span-2 bg-[#0F0F0F] text-white py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#B38B59] transition-colors">
                Confirmer ma demande de réservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}