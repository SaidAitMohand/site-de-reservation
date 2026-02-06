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

  // --- ÉTATS POUR LE CHANGEMENT DE MOT DE PASSE ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  //chargement des utilisateurs
  /*const [users, setUsers] = useState([
    { id: 1, name: "Amine K.", role: "Client", email: "amine@mail.com", active: true },
    { id: 2, name: "Karine K.", role: "Propriétaire", email: "karine@mail.com", active: true },
    { id: 3, name: "Hocine B.", role: "Propriétaire", email: "hocine@mail.com", active: false },
  ]);
  */
  const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3000/users')
        .then(res => {
            if(!res.ok){
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }
            return res.json();
        })
        .then(data => {
            setUsers(data);
        })
    }, []);


  //fonction qui change l'etat de l'utilisateur
  const switchEtat = (user) => {
      const newStatus = (user.status === 1)? 0 : 1 

      fetch(`http://localhost:3000/users/${user.id}/status`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
          
      })
      .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json(); // On retourne la promesse ici
      })
      .then((data) => {
          // 'data' contient maintenant l'utilisateur mis à jour renvoyé par le backend
          setUsers(prev =>
              prev.map(u => (u.id == data.id) ? { ...u, status: newStatus } : u)
          );
      })
      .catch(error => {
          console.error('Erreur lors de la mise à jour du statut:', error);
      });

      console.log(`Changement de statut pour l'utilisateur ${user.id} vers ${newStatus}`);
  };

  /*const [rooms, setRooms] = useState([
    { 
      id: 101, 
      name: "Le Grand Ballroom", 
      owner: "Karine K.", 
      city: "Alger",
      wilaya: "16 Alger",
      type: "Salle de Fêtes",
      status: "Validée",
      price: 12000,
      capacity: 300,
      images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600"],
      description: "Une salle luxueuse située au coeur d'Alger."
    },
    { 
      id: 102, 
      name: "Salle Suspecte", 
      owner: "Inconnu", 
      city: "Oran",
      wilaya: "31 Oran",
      type: "Espace Coworking",
      status: "En attente",
      price: 5000,
      capacity: 50,
      images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600"],
      description: "Petite salle de réunion sans photos vérifiées."
    },
  ]);*/
  //fetch des salles depuis le backend
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/salles')
    .then(res=>{
      if(!res.ok){
        throw new Error('Erreur lors de la récupération des salles');
      }
      return res.json();
    })
    .then(data => {
      setRooms(data);
    })
  }, []);
  console.log("voici les rooms : ", rooms );

  const [reviews, setReviews] = useState([
    { id: 1, user: "Amine K.", room: "Le Grand Ballroom", comment: "Superbe expérience !", rating: 5 },
    { id: 2, user: "Anonyme", room: "Hôtel Royal", comment: "Publicité mensongère.", rating: 1 },
  ]);

  //  ÉTATS FILTRES & RECHERCHE 
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("Tous");
  const [roomFilter, setRoomFilter] = useState("Tous");
  const [inspectingRoom, setInspectingRoom] = useState(null);

  
  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const toggleRoomStatus = (id) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, status: r.status === "Validée" ? "Désactivée" : "Validée" } : r));
  };

  const deleteReview = (id) => {
    if(window.confirm("Supprimer cet avis ?")) setReviews(reviews.filter(rev => rev.id !== id));
  };

  // --- LOGIQUE CHANGEMENT MOT DE PASSE ---
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    // Simulation de vérification (on compare au mdp par défaut)
    const currentStoredPass = "admin2026"; 

    if (passwordData.current !== currentStoredPass) {
      setPwError("Le mot de passe actuel est incorrect.");
      return;
    }

    if (passwordData.next !== passwordData.confirm) {
      setPwError("La confirmation ne correspond pas.");
      return;
    }

    setPwSuccess("Mot de passe mis à jour avec succès.");
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordData({ current: "", next: "", confirm: "" });
      setPwSuccess("");
    }, 2000);
  };

  // --- FILTRAGE AVANCÉ ---
  const filteredUsers = users.filter(u => 
    (userFilter === "Tous" || u.role === userFilter) &&
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = rooms.filter(r => 
    (roomFilter === "Tous" || r.status === roomFilter) &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentAdmin = localStorage.getItem("adminName") || "SUPER-ADMIN";

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20 text-[#0F0F0F]">
      
      {/* HEADER NAV */}
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
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-[#B38B59] transition-all"
          >
            Sécurité
          </button>
          <button 
            onClick={handleLogout} 
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 border border-red-100 px-6 py-2.5 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16">
        {/* TITRE & RECHERCHE */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
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
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-5">
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-[10px] opacity-40 italic mt-0.5">{user.role} — {user.username}</p>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => switchEtat(user)}
                            className={`text-[9px] font-bold uppercase px-4 py-2 border transition-all tracking-widest ${user.status ? 'border-red-100 text-red-500 hover:bg-red-50' : 'border-green-100 text-green-500 hover:bg-green-50'}`}
                          >
                            {user.status ? "Bannir" : "Réactiver"}
                          </button>
                        </td>
                      </tr>
                    ))}
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              {label: "Volume d'affaires", val: "2.4M DA"}, 
              {label: "Salles Validées", val: rooms.filter(r => r.status === "Validée").length}, 
              {label: "Retours Clients", val: reviews.length}, 
              {label: "Comptes Restreints", val: users.filter(u => !u.active).length}
            ].map((st, i) => (
                <div key={i} className="bg-white p-8 border border-stone-200 shadow-sm hover:border-[#B38B59] transition-all group">
                    <p className="text-[9px] uppercase font-bold opacity-30 mb-2 group-hover:text-[#B38B59] tracking-widest">{st.label}</p>
                    <p className="text-2xl font-serif italic">{st.val}</p>
                </div>
            ))}
        </div>
      </main>

      {/* MODALE CHANGEMENT MOT DE PASSE */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md p-10 shadow-2xl border border-stone-200">
            <h2 className="font-serif italic text-3xl mb-2 text-center">Sécurité</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 text-center mb-8">Changer votre mot de passe</p>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Mot de passe actuel</label>
                <input 
                  type="password" required
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm"
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Nouveau mot de passe</label>
                <input 
                  type="password" required
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm"
                  onChange={(e) => setPasswordData({...passwordData, next: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest opacity-50 block mb-2">Confirmer le nouveau</label>
                <input 
                  type="password" required
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#B38B59] bg-transparent text-sm"
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                />
              </div>

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