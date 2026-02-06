import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- SÉCURITÉ ---
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminName");
    navigate("/admin-login");
  };

  // --- ÉTATS ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([
    { id: 1, user: "Amine K.", room: "Le Grand Ballroom", comment: "Superbe expérience !", rating: 5 },
    { id: 2, user: "Anonyme", room: "Hôtel Royal", comment: "Publicité mensongère.", rating: 1 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("Tous");
  const [roomFilter, setRoomFilter] = useState("Tous");
  const [inspectingRoom, setInspectingRoom] = useState(null);

  const currentAdmin = localStorage.getItem("adminName") || "SUPER-ADMIN";

  // --- FETCH USERS ---
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => {
        if (!res.ok) throw new Error("Erreur récupération utilisateurs");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  // --- FETCH ROOMS ---
  useEffect(() => {
    fetch("http://localhost:3000/salles")
      .then(res => {
        if (!res.ok) throw new Error("Erreur récupération salles");
        return res.json();
      })
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  // --- MODIFICATION STATUT USER ---
  const switchEtat = (user) => {
    const newStatus = user.status === 1 ? 0 : 1;

    fetch(`http://localhost:3000/users/${user.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then(() => {
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
      })
      .catch(err => console.error(err));
  };

  // --- MODIFICATION STATUT ROOM ---
  const toggleRoomStatus = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newStatus = room.status === "Validée" ? "Désactivée" : "Validée";

    fetch(`http://localhost:3000/salles/${roomId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then(() => {
        setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, status: newStatus } : r)));
      })
      .catch(err => console.error(err));
  };

  // --- SUPPRESSION REVIEW ---
  const deleteReview = (id) => {
    if (window.confirm("Supprimer cet avis ?")) {
      setReviews(reviews.filter(rev => rev.id !== id));
    }
  };

  // --- CHANGEMENT MOT DE PASSE ---
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    const currentStoredPass = "admin2026"; // simulation

    if (passwordData.current !== currentStoredPass) {
      setPwError("Mot de passe actuel incorrect");
      return;
    }
    if (passwordData.next !== passwordData.confirm) {
      setPwError("Confirmation ne correspond pas");
      return;
    }

    setPwSuccess("Mot de passe mis à jour !");
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordData({ current: "", next: "", confirm: "" });
      setPwSuccess("");
    }, 2000);
  };

  // --- FILTRAGE ---
  const filteredUsers = users.filter(u =>
    (userFilter === "Tous" || u.role === userFilter) &&
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = rooms.filter(r =>
    (roomFilter === "Tous" || r.status === roomFilter) &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20 text-[#0F0F0F]">

      {/* HEADER */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-stone-200/60">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif italic text-2xl shadow-md">
            {currentAdmin.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{currentAdmin}</p>
            <p className="text-[9px] text-[#B38B59] uppercase font-medium tracking-tight">Console de Contrôle Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowPasswordModal(true)} className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-[#B38B59] transition-all">
            Sécurité
          </button>
          <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 border border-red-100 px-6 py-2.5 hover:bg-red-500 hover:text-white transition-all duration-300">
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16">

        {/* TITRE & RECHERCHE */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-8">
          <div>
            <h1 className="text-5xl font-serif italic text-[#0F0F0F]">Console de Modération</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mt-3 font-bold">Flux de gestion RoomBook</p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="RECHERCHER DANS LA BASE..."
              className="w-full bg-white border border-stone-200 px-5 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#B38B59] shadow-sm transition-colors"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* UTILISATEURS ET SALLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">

            {/* SECTION UTILISATEURS */}
            <section className="bg-white border border-stone-200 shadow-sm">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Utilisateurs ({filteredUsers.length})</h2>
                <select
                  className="text-[10px] font-bold uppercase bg-transparent border-none focus:ring-0 cursor-pointer text-[#B38B59]"
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <option value="Tous">Tous les rôles</option>
                  <option value="Propriétaire">Propriétaires</option>
                  <option value="Client">Clients</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map(user => {
                      const isActive = user.status === 1;
                      return (
                        <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-5">
                            <p className="text-sm font-bold">{user.name}</p>
                            <p className="text-[10px] opacity-40 italic mt-0.5">{user.role} — {user.username}</p>
                          </td>
                          <td className="p-5">
                            <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {isActive ? "Compte Actif" : "Banni"}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => switchEtat(user)}
                              className={`text-[9px] font-bold uppercase px-4 py-2 border transition-all tracking-widest ${isActive ? 'border-red-100 text-red-500 hover:bg-red-50' : 'border-green-100 text-green-500 hover:bg-green-50'}`}
                            >
                              {isActive ? "Bannir" : "Réactiver"}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION SALLES */}
            <section className="bg-white border border-stone-200 shadow-sm">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Flux des Salles</h2>
                <div className="flex gap-6">
                  {["Tous", "En attente", "Validée"].map(f => (
                    <button
                      key={f}
                      onClick={() => setRoomFilter(f)}
                      className={`text-[10px] font-bold uppercase tracking-tighter transition-all ${roomFilter === f ? 'text-[#B38B59] border-b-2 border-[#B38B59] pb-1' : 'opacity-30 hover:opacity-100'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-stone-100">
                    {filteredRooms.map(room => (
                      <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-5">
                          <p className="text-sm font-bold">{room.name}</p>
                          <p className="text-[10px] opacity-40 uppercase mt-0.5">{room.wilaya} — Par {room.owner}</p>
                        </td>
                        <td className="p-5">
                          <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${room.status === 'Validée' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="p-5 text-right flex items-center justify-end gap-5">
                          <button onClick={() => setInspectingRoom(room)} className="text-[10px] font-bold uppercase underline decoration-stone-200 hover:text-[#B38B59] transition-colors">Inspecter</button>
                          <button onClick={() => toggleRoomStatus(room.id)} className="text-[9px] font-bold uppercase text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all tracking-widest">
                            {room.status === "Validée" ? "Désactiver" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* SECTION AVIS */}
          <section className="bg-white border border-stone-200 shadow-sm h-fit">
            <div className="p-6 border-b border-stone-100 bg-stone-50/30">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#B38B59]">Modération Avis</h2>
            </div>
            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {reviews.map(rev => (
                <div key={rev.id} className="p-6 group hover:bg-stone-50 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#B38B59] text-xs">{"★".repeat(rev.rating)}</span>
                    <button onClick={() => deleteReview(rev.id)} className="opacity-0 group-hover:opacity-100 text-[9px] text-red-500 font-bold uppercase underline transition-all">Supprimer</button>
                  </div>
                  <p className="text-[13px] italic text-stone-700 leading-relaxed font-serif">"{rev.comment}"</p>
                  <div className="mt-4 flex justify-between items-end border-t border-stone-50 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-tighter">{rev.user}</p>
                    <p className="text-[9px] opacity-30 uppercase italic">{rev.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* MODALE CHANGEMENT MOT DE PASSE */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md p-10 shadow-2xl border border-stone-200">
            <h2 className="font-serif italic text-3xl mb-2 text-center">Sécurité</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 text-center mb-8">Changer votre mot de passe</p>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              {["current", "next", "confirm"].map((field, idx) => (
                <div key={idx}>
                  <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">
                    {field === "current" ? "Mot de passe actuel" : field === "next" ? "Nouveau mot de passe" : "Confirmer le nouveau"}
                  </label>
                  <input
                    type="password" required
                    className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm"
                    onChange={e => setPasswordData(prev => ({ ...prev, [field]: e.target.value }))}
                  />
                </div>
              ))}

              {pwError && <p className="text-[9px] text-red-500 font-bold uppercase">{pwError}</p>}
              {pwSuccess && <p className="text-[9px] text-green-600 font-bold uppercase">{pwSuccess}</p>}

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#B38B59] transition-all">
                  Valider
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-6 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL D'INSPECTION */}
      {inspectingRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F2] w-full max-w-4xl p-12 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setInspectingRoom(null)} className="absolute top-8 right-8 text-3xl hover:rotate-90 transition-transform">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Preuves Visuelles</p>
                <div className="grid grid-cols-1 gap-3">
                  {inspectingRoom.images.map((url, i) => (
                    <img key={i} src={url} className="w-full h-56 object-cover border border-stone-200" alt="" />
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-serif italic mb-2">{inspectingRoom.name}</h2>
                  <p className="text-[11px] font-bold text-[#B38B59] uppercase tracking-[0.3em]">{inspectingRoom.wilaya} — {inspectingRoom.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-stone-200 text-xs">
                  <div><p className="opacity-30 uppercase text-[10px] font-bold mb-1">Propriétaire</p><p className="font-bold text-sm">{inspectingRoom.owner}</p></div>
                  <div><p className="opacity-30 uppercase text-[10px] font-bold mb-1">Tarification</p><p className="font-bold text-sm">{inspectingRoom.price} DA</p></div>
                  <div><p className="opacity-30 uppercase text-[10px] font-bold mb-1">Capacité Max</p><p className="font-bold text-sm">{inspectingRoom.capacity} invités</p></div>
                </div>
                <div className="pt-6 border-t border-stone-200">
                  <p className="text-[10px] uppercase opacity-30 font-bold mb-3 tracking-widest">Description de l'annonce</p>
                  <p className="text-sm italic text-stone-600 leading-loose bg-white p-6 border border-stone-100">{inspectingRoom.description}</p>
                </div>
                <div className="pt-8">
                  <button
                    onClick={() => { toggleRoomStatus(inspectingRoom.id); setInspectingRoom(null); }}
                    className="w-full bg-black text-white py-5 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[#B38B59] transition-all"
                  >
                    {inspectingRoom.status === "Validée" ? "Révoquer l'accès" : "Valider l'entrée au catalogue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
