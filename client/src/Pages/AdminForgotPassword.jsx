import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-stone-200 p-10 md:p-14 shadow-sm">
        <h2 className="font-serif italic text-3xl mb-4 text-center">Récupération</h2>
        <p className="text-center text-[10px] text-stone-400 mb-10 uppercase tracking-widest font-bold">Lien de secours administrateur</p>

        {!submitted ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
            <input type="email" required placeholder="votre@email-admin.dz" className="w-full border-b border-stone-200 py-3 outline-none focus:border-[#B38B59] bg-transparent text-sm" onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-widest">Recevoir le lien</button>
          </form>
        ) : (
          <div className="bg-green-50 p-6 text-center border-l-2 border-green-500">
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">E-mail envoyé à : <br/><span className="text-black">{email}</span></p>
          </div>
        )}

        <div className="mt-12 text-center border-t border-stone-100 pt-8">
          <Link to="/admin-login" className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100 transition-all text-black">← Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}