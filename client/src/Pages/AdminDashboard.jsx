import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [Users, setUsers] = useState([]);
  const [Rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Centralisation des clés de stockage
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const currentAdmin = localStorage.getItem("adminName") || "ADMIN";

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin || !token) {
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        };

        // Appels aux routes préfixées par /admin (conforme à ton backend)
        const [usersRes, roomsRes] = await Promise.all([
          fetch("http://localhost:4000/admin/users", { headers }),
          fetch("http://localhost:4000/admin/salles", { headers })
        ]);

        if (usersRes.ok && roomsRes.ok) {
          const usersData = await usersRes.json();
          const roomsData = await roomsRes.json();
          setUsers(usersData);
          setRooms(roomsData);
        } else {
          console.error("Erreur : Statut HTTP non valide");
        }
      } catch (err) {
        console.error("Erreur récupération :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const switchEtat = async (user) => {
    const newStatus = !user.status;
    try {
      const res = await fetch(`http://localhost:4000/admin/users/${user.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRoomStatus = async (roomId) => {
    const room = Rooms.find((r) => r.id === roomId);
    if (!room) return;

    const newStatus = room.status === "Validée" ? "Désactivée" : "Validée";

    try {
      const res = await fetch(`http://localhost:4000/admin/salles/${roomId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRooms((prev) =>
          prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic bg-[#F9F6F2] min-h-screen">
        Chargement sécurisé...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans pb-20 text-[#0F0F0F]">
      
      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-stone-200/60">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif italic text-2xl shadow-md">
            {currentAdmin.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {currentAdmin}
            </p>
            <p className="text-[9px] text-[#B38B59] uppercase font-medium tracking-tight">
              Console Active
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[10px] font-bold uppercase border border-red-100 px-6 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"
        >
          Déconnexion
        </button>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 pt-16">
        <h1 className="text-5xl font-serif italic mb-8">Modération</h1>
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

            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-stone-100">
                {Users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-5">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[10px] opacity-40">{user.username}</p>
                    </td>

                    <td className="p-5">
                      <span className={user.status ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {user.status ? "Actif" : "Banni"}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => switchEtat(user)}
                        className={`text-[9px] font-bold uppercase px-4 py-2 border transition-all ${
                          user.status ? "hover:bg-red-500 hover:text-white hover:border-red-500" : "hover:bg-black hover:text-white hover:border-black"
                        }`}
                      >
                        {user.status ? "Bannir" : "Réactiver"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* SECTION SALLES */}
          <section className="bg-white border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 bg-stone-50/50 border-b border-stone-100">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                Salles ({Rooms.length})
              </h2>
            </div>

            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-stone-100">
                {Rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-5">
                      <p className="text-sm font-bold">{room.nom || room.name}</p>
                      <p className="text-[10px] opacity-40">Capacité: {room.capacite || "N/A"}</p>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => toggleRoomStatus(room.id)}
                        className="text-[9px] font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
                      >
                        {room.status === "Validée" ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

        </div>
      </main>
    </div>
  );
}