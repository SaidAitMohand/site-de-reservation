import { useState } from "react";
import Header from "../Components/Header";

export default function OwnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [previews, setPreviews] = useState([]);
  
  // Correction de l'état pour les réponses
  const [replyText, setReplyText] = useState({ reviewId: null, text: "" });
  
  const [selectedTypes, setSelectedTypes] = useState([]);
  const eventOptions = ["Mariage", "Conférence", "Anniversaire", "Shooting", "Dîner", "Séminaire"];
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const [myRooms, setMyRooms] = useState([
    { 
      id: 1, 
      name: "Le Grand Ballroom", 
      views: 1240, 
      price: "12000",
      revenue: "144.000",
      types: ["Mariage", "Dîner"],
      description: "Un espace luxueux avec lustres en cristal, sonorisation JBL intégrée.",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300",
      bookings: [
        { id: 101, date: "2024-05-20", time: "14:00 - 18:00", client: "Mariage Benali", status: "En attente" },
      ],
      reviews: [
        { 
          id: 1, 
          user: "Amine K.", 
          comment: "Superbe salle !", 
          rating: 5,
          ownerReply: "Merci beaucoup !" 
        }
      ]
    }
  ]);

  // --- LOGIQUE RÉPONSES (CORRIGÉE POUR LA MODIFICATION) ---
  const handleSaveReply = (roomId, reviewId) => {
    setMyRooms(myRooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          reviews: room.reviews.map(rev => 
            rev.id === reviewId ? { ...rev, ownerReply: replyText.text } : rev
          )
        };
      }
      return room;
    }));
    setReplyText({ reviewId: null, text: "" }); // Reset après sauvegarde
  };

  const deleteReply = (roomId, reviewId) => {
    if(window.confirm("Supprimer votre réponse ?")) {
      setMyRooms(myRooms.map(room => room.id === roomId ? {
        ...room, reviews: room.reviews.map(rev => rev.id === reviewId ? { ...rev, ownerReply: null } : rev)
      } : room));
    }
  };

  // --- ACTIONS RÉSERVATIONS (CONFIRMER / SUSPENDRE) ---
  const updateBookingStatus = (roomId, bookingId, currentStatus) => {
    const newStatus = currentStatus === "En attente" ? "Confirmé" : "En attente";
    setMyRooms(myRooms.map(room => (room.id === roomId ? {
      ...room, bookings: room.bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    } : room)));
  };

  const deleteBooking = (roomId, bookingId) => {
    if(window.confirm("Supprimer ce rendez-vous ?")) {
      setMyRooms(myRooms.map(room => (room.id === roomId ? {
        ...room, bookings: room.bookings.filter(b => b.id !== bookingId)
      } : room)));
    }
  };

  const openEditModal = (room = null) => {
    setEditingRoom(room);
    setPreviews(room ? [room.img] : []);
    setSelectedTypes(room ? room.types : []);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <Header userName="KABICHE Karine" onOpenSettings={() => setIsSettingsOpen(true)} />

        <div className="flex justify-between items-end mb-16 mt-10">
          <h1 className="text-4xl font-serif italic text-[#0F0F0F]">Votre Espace Client</h1>
          <button onClick={() => openEditModal()} className="bg-[#0F0F0F] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59] transition-all">+ Nouvelle Salle</button>
        </div>

        {/* RÉSERVATIONS (CONFIRMER / SUSPENDRE) */}
        <section className="mb-20">
          <h2 className="text-xl font-serif italic mb-6 border-b border-stone-200 pb-2">Suivi des Demandes</h2>
          <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0F0F0F] text-white text-[9px] uppercase tracking-widest">
                <tr><th className="p-6">Espace</th><th className="p-6">Client</th><th className="p-6 text-center">État</th><th className="p-6 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100 italic">
                {myRooms.flatMap(room => room.bookings.map(b => (
                  <tr key={b.id} className="text-xs">
                    <td className="p-6 font-bold uppercase not-italic">{room.name}</td>
                    <td className="p-6">{b.client}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-bold uppercase not-italic ${b.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{b.status}</span>
                    </td>
                    <td className="p-6 text-right space-x-6">
                      <button onClick={() => updateBookingStatus(room.id, b.id, b.status)} className={`text-[9px] font-bold uppercase underline not-italic ${b.status === 'En attente' ? 'text-green-600' : 'text-orange-500'}`}>
                        {b.status === 'En attente' ? 'Confirmer' : 'Suspendre'}
                      </button>
                      <button onClick={() => deleteBooking(room.id, b.id)} className="text-[9px] font-bold uppercase text-red-500 not-italic">Supprimer</button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ANNONCES & MODÉRATION */}
        <section className="space-y-12">
          {myRooms.map(room => (
            <div key={room.id} className="bg-white border border-stone-200 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-80 h-64 overflow-hidden"><img src={room.img} className="w-full h-full object-cover" alt="" /></div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-serif">{room.name}</h3>
                    <div className="flex gap-4">
                        <button onClick={() => openEditModal(room)} className="text-[9px] font-bold uppercase border-b border-black">Modifier</button>
                        <button onClick={() => { if(window.confirm("Supprimer?")) setMyRooms(myRooms.filter(r => r.id !== room.id)) }} className="text-[9px] font-bold uppercase text-red-500">Retirer</button>
                    </div>
                  </div>
                  <div className="flex gap-8 mt-10 border-t pt-6">
                    <div><span className="block text-[8px] uppercase opacity-40">Tarif</span><span className="text-lg font-serif italic text-[#B38B59]">{room.price} DA</span></div>
                    <div><span className="block text-[8px] uppercase opacity-40">Revenu Global</span><span className="text-lg font-serif italic">💰 {room.revenue} DA</span></div>
                  </div>
                </div>
              </div>

              {/* AVIS & RÉPONSES MODIFIABLES */}
              <div className="bg-stone-50 p-8 border-t border-stone-100">
                <h4 className="text-[10px] uppercase font-bold mb-6 opacity-40 italic">Modération & Interactions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {room.reviews.map(rev => (
                    <div key={rev.id} className="bg-white p-5 border border-stone-200 relative group">
                      <button onClick={() => {if(window.confirm("Supprimer l'avis client ?")) setMyRooms(myRooms.map(r => r.id === room.id ? {...r, reviews: r.reviews.filter(re => re.id !== rev.id)} : r))}} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 text-[8px] uppercase font-bold transition-opacity">Supprimer l'avis</button>
                      <p className="text-sm italic mb-2">"{rev.comment}"</p>
                      
                      {rev.ownerReply && replyText.reviewId !== rev.id ? (
                        <div className="mt-4 p-3 bg-[#F9F6F2] border-l-2 border-[#B38B59] relative group/reply">
                          <p className="text-[8px] uppercase font-bold text-[#B38B59] mb-1">Votre réponse :</p>
                          <p className="text-xs italic text-stone-600">"{rev.ownerReply}"</p>
                          <div className="flex gap-3 mt-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                            <button onClick={() => setReplyText({ reviewId: rev.id, text: rev.ownerReply })} className="text-[8px] font-bold uppercase text-stone-400 hover:text-black">Modifier</button>
                            <button onClick={() => deleteReply(room.id, rev.id)} className="text-[8px] font-bold uppercase text-red-400">Supprimer</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {replyText.reviewId === rev.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea 
                                onChange={(e) => setReplyText({ ...replyText, text: e.target.value })} 
                                value={replyText.text} 
                                className="w-full p-2 text-xs border border-stone-200 outline-none italic bg-[#F9F6F2]" 
                                placeholder="Écrire votre réponse..."
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleSaveReply(room.id, rev.id)} className="bg-black text-white text-[8px] py-2 px-4 uppercase font-bold">Enregistrer</button>
                                <button onClick={() => setReplyText({ reviewId: null, text: "" })} className="text-[8px] uppercase font-bold opacity-50">Annuler</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setReplyText({ reviewId: rev.id, text: "" })} className="text-[9px] font-bold uppercase underline">Répondre</button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* MODAL SALLE (PHOTOS & TYPES) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-12 shadow-2xl overflow-y-auto max-h-[90vh] relative text-[#0F0F0F]">
            <h2 className="text-2xl font-serif italic mb-10">{editingRoom ? "Editer l'établissement" : "Nouvelle Salle"}</h2>
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Types d'événements autorisés</label>
                <div className="flex flex-wrap gap-2">
                  {eventOptions.map(t => (
                    <button key={t} type="button" onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])} className={`px-4 py-2 text-[8px] uppercase font-bold border ${selectedTypes.includes(t) ? "bg-black text-white" : "border-stone-300"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-[#B38B59]">Galerie Photos (Upload)</label>
                <div className="flex flex-wrap gap-4">
                  {previews.map((src, i) => (
                    <div key={i} className="w-24 h-24 border relative group">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => setPreviews(previews.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 text-[8px] font-bold uppercase">Supprimer</button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-stone-300 flex items-center justify-center cursor-pointer text-2xl opacity-20 hover:opacity-100 transition-all">
                    + <input type="file" multiple onChange={(e) => setPreviews([...previews, URL.createObjectURL(e.target.files[0])])} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col border-b border-stone-300 py-2"><label className="text-[9px] uppercase font-bold opacity-40">Nom de la salle</label><input type="text" defaultValue={editingRoom?.name} className="bg-transparent outline-none italic text-lg" /></div>
                <div className="flex flex-col border-b border-stone-300 py-2"><label className="text-[9px] uppercase font-bold opacity-40">Tarif Journalier (DA)</label><input type="number" defaultValue={editingRoom?.price} className="bg-transparent outline-none font-bold text-lg" /></div>
              </div>

              <div className="flex flex-col border-b border-stone-300 py-2">
                <label className="text-[9px] uppercase font-bold opacity-40">Description & Services</label>
                <textarea rows="2" defaultValue={editingRoom?.description} className="bg-transparent outline-none text-sm py-2 italic resize-none" />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-grow bg-[#0F0F0F] text-white py-5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59]">Sauvegarder les changements</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 border border-black text-[10px] uppercase font-bold">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SÉCURITÉ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F0F0F]/95 backdrop-blur-md p-4">
          <div className="bg-[#F9F6F2] w-full max-w-md p-10 shadow-2xl relative text-[#0F0F0F]">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 opacity-30 hover:opacity-100">✕</button>
            <h2 className="text-xl font-serif italic mb-8">Sécurité Compte</h2>
            <div className="space-y-5">
              <input type="password" placeholder="Ancien mot de passe" className="w-full bg-transparent border-b border-stone-300 py-2 outline-none" />
              <input type="password" placeholder="Nouveau mot de passe" className="w-full bg-transparent border-b border-stone-300 py-2 outline-none" />
              <input type="password" placeholder="Confirmer nouveau" className="w-full bg-transparent border-b border-stone-300 py-2 outline-none" />
              <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-[#0F0F0F] text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B38B59]">Mettre à jour</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}