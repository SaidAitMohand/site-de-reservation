import { useState } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const Navigate = useNavigate();

  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [bookingData, setBookingData] = useState({
    name: "",
    eventType: "",
    date_debut: "",
    date_fin: "",
    notes: ""
  });

  const eventOptions = ["Mariage", "Conférence", "Anniversaire", "Shooting", "Dîner", "Séminaire"];

  const wilayas = [
    "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar", "09 Blida", "10 Bouira", 
    "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger", "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", 
    "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma", "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla", 
    "31 Oran", "32 El Bayadh", "33 Illizi", "34 Bordj Bou Arreridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued", "40 Khenchela", 
    "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", "47 Ghardaïa", "48 Relizane", "49 El M'Ghair", "50 El Meniaa", 
    "51 Ouled Djellal", "52 Bordj Baji Mokhtar", "53 Béni Abbès", "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
  ];

  const [availableRooms] = useState([
    { id: 1, name: "Le Grand Ballroom", city: "16 Alger", price: 12000, img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600", unavailableSlots: [] },
    { id: 2, name: "L'Espace Médina", city: "31 Oran", price: 8500, img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600", unavailableSlots: [] },
    { id: 3, name: "Hôtel Royal", city: "23 Annaba", price: 25000, img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600", unavailableSlots: [] }
  ]);

  const [myBookings, setMyBookings] = useState([
    { id: 1, roomName: "Le Grand Ballroom", city: "16 Alger", date_debut: "2024-05-20", date_fin: "2024-05-21", type: "Mariage", status: "En attente" }
  ]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!bookingData.date_debut || !bookingData.date_fin || !bookingData.name) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      roomName: selectedRoom.name,
      city: selectedRoom.city,
      name: bookingData.name,
      date_debut: bookingData.date_debut,
      date_fin: bookingData.date_fin,
      type: bookingData.eventType,
      status: "En attente"
    };

    setMyBookings([newEntry, ...myBookings]);
    alert(`Demande envoyée pour ${selectedRoom.name} (${selectedRoom.city}) !`);
    setSelectedRoom(null);
    setBookingData({ name: "", eventType: "", date_debut: "", date_fin: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName="Amine K." />

        {/* Suivi des réservations */}
        <section className="mb-16 mt-10">
          <h2 className="text-xl font-serif italic mb-6 border-b border-stone-200 pb-2">Suivi de mes réservations</h2>
          <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#0F0F0F] text-white text-[9px] uppercase tracking-widest">
                <tr>
                  <th className="p-4">Établissement / Wilaya</th>
                  <th className="p-4">Événement</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4 text-center">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs italic">
                {myBookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-4">
                      <span className="block font-bold not-italic">{b.roomName}</span>
                      <span className="text-[10px] opacity-50">{b.city}</span>
                    </td>
                    <td className="p-4">{b.type}</td>
                    <td className="p-4">{b.date_debut} → {b.date_fin}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase not-italic ${b.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-white p-8 border border-stone-200 shadow-sm">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold opacity-40 mb-2">Filtrer par Wilaya</label>
            <select value={filterWilaya} onChange={(e) => setFilterWilaya(e.target.value)} className="bg-transparent border-b border-stone-300 py-2 outline-none italic text-sm">
              <option value="">Toute l'Algérie (58 Wilayas)</option>
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold opacity-40 mb-2">Budget Max (DA)</label>
            <input type="number" value={filterBudget} onChange={(e) => setFilterBudget(e.target.value)} className="bg-transparent border-b border-stone-300 py-2 outline-none font-bold text-sm" placeholder="Ex: 60000" />
          </div>
        </div>

        {/* Liste des salles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {availableRooms
            .filter(r => (filterWilaya === "" || r.city === filterWilaya) && (filterBudget === "" || r.price <= parseInt(filterBudget)))
            .map(room => (
              <div key={room.id} className="bg-white border border-stone-200 group relative">
                <div className="h-56 overflow-hidden relative">
                  <img src={room.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute top-4 left-4 bg-[#0F0F0F] text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest">{room.city}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2">{room.name}</h3>
                  <p className="text-[#B38B59] font-serif italic">{room.price} DA <span className="text-[10px] text-stone-400 not-italic uppercase tracking-widest">/ Jour</span></p>
                  <button onClick={() => setSelectedRoom(room)} className="mt-6 w-full border border-black py-4 text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all">Détails & Réserver</button>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Modal réservation */}
      {selectedRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6 text-xl">✕</button>
            <div className="mb-8 border-b border-stone-200 pb-4">
              <h2 className="text-3xl font-serif italic">{selectedRoom.name}</h2>
              <p className="text-[10px] uppercase font-bold text-[#B38B59] tracking-widest mt-1">Localisation : {selectedRoom.city}</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col border-b border-stone-300 py-2 md:col-span-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Nom</label>
                <input required type="text" value={bookingData.name} onChange={(e) => setBookingData({...bookingData, name: e.target.value})} className="bg-transparent outline-none italic" />
              </div>
              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Type d'événement</label>
                <select required value={bookingData.eventType} onChange={(e) => setBookingData({...bookingData, eventType: e.target.value})} className="bg-transparent outline-none italic">
                  <option value="">Choisir le type...</option>
                  {eventOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Date de début</label>
                <input required type="date" value={bookingData.date_debut} onChange={(e) => setBookingData({...bookingData, date_debut: e.target.value})} className="bg-transparent outline-none" />
              </div>
              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Date de fin</label>
                <input required type="date" value={bookingData.date_fin} onChange={(e) => setBookingData({...bookingData, date_fin: e.target.value})} className="bg-transparent outline-none" />
              </div>
              <div className="md:col-span-2 flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Détails de la demande (Notes spéciales)</label>
                <textarea rows="3" value={bookingData.notes} onChange={(e) => setBookingData({...bookingData, notes: e.target.value})} className="bg-transparent outline-none italic text-sm resize-none" placeholder="Décrivez vos besoins (ex: nombre d'invités, buffet, décoration...)" />
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
