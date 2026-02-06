import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- SÉCURITÉ ---
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("token"); // <== ajoute le token
    if (!isAdmin || !token) navigate("/admin-login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminName");
    localStorage.removeItem("token"); // <== supprime token
    navigate("/admin-login");
  };

  // --- ÉTATS ---
  const [Users, setUsers] = useState([]);
  const [Rooms, setRooms] = useState([]);
  const currentAdmin = localStorage.getItem("adminName") || "SUPER-ADMIN";
  const token = localStorage.getItem("token"); // <== récupère token

  // --- FETCH USERS ---
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/users", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du fetch des utilisateurs");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, [token]);

  // --- FETCH ROOMS ---
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/owner/salles", { // <== change l’URL pour back owner
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du fetch des salles");
        return res.json();
      })
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, [token]);

  // --- MODIFICATION STATUT USER ---
  const switchEtat = (user) => {
    const newStatus = user.status === 1 ? 0 : 1;

    fetch(`http://localhost:3000/users/${user.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // <== ajoute token
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(() => {
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
      })
      .catch(err => console.error(err));
  };

  // --- MODIFICATION STATUT ROOM ---
  const toggleRoomStatus = (roomId) => {
    const room = Rooms.find(r => r.id === roomId);
    if (!room) return;

    const newStatus = room.status === "Validée" ? "Désactivée" : "Validée";

    fetch(`http://localhost:3000/salles/${roomId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // <== ajoute token
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(() => {
        setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, status: newStatus } : r)));
      })
      .catch(err => console.error(err));
  };

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
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 border border-red-100 px-6 py-2.5 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16">

        <h1 className="text-5xl font-serif italic text-[#0F0F0F] mb-8">Console de Modération</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* UTILISATEURS */}
          <section className="bg-white border border-stone-200 shadow-sm">
            <div className="p-6 border-b border-stone-100 bg-stone-50/30">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                Utilisateurs ({Users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-stone-100">
                  {Users.map(user => {
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

          {/* SALLES */}
          <section className="bg-white border border-stone-200 shadow-sm">
            <div className="p-6 border-b border-stone-100 bg-stone-50/30">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                Salles ({Rooms.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-stone-100">
                  {Rooms.map(room => (
                    <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-5">
                        <p className="text-sm font-bold">{room.name}</p>
                        <p className="text-[10px] opacity-40 mt-0.5">{room.wilaya} — Par {room.owner}</p>
                      </td>
                      <td className="p-5">
                        <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${room.status === 'Validée' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => toggleRoomStatus(room.id)}
                          className="text-[9px] font-bold uppercase text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all tracking-widest"
                        >
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
      </main>

    </div>
  );
}
