import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [step, setStep] = useState("login");

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput(""); 
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      alert("Code de sécurité incorrect.");
      generateCaptcha();
      return;
    }
    console.log("Connexion ROOMBOOK en cours...");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Instructions envoyées à : ${email}`);
    setStep("login");
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] selection:bg-[#B38B59] selection:text-white flex flex-col">
      <Navbar />

      {}
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-[480px] bg-white border border-[#0F0F0F]/5 p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all">
          
          {step === "login" ? (
            <div className="space-y-12">
              {}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif text-[#0F0F0F] tracking-tight italic">Se connecter</h1>
                <div className="flex items-center justify-center gap-4">
                  <span className="h-[1px] w-10 bg-[#B38B59]/30"></span>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#B38B59] font-bold">Espace ROOMBOOK</p>
                  <span className="h-[1px] w-10 bg-[#B38B59]/30"></span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">

                <div className="space-y-6">
                  <div className="group flex flex-col border-b border-[#0F0F0F]/10 focus-within:border-[#B38B59] transition-all py-2">
                    <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold mb-1 group-focus-within:text-[#B38B59]">Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="votre@email.com"
                      className="bg-transparent outline-none text-lg italic placeholder:text-stone-200 placeholder:not-italic"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="group flex flex-col border-b border-[#0F0F0F]/10 focus-within:border-[#B38B59] transition-all py-2">
                    <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold mb-1 group-focus-within:text-[#B38B59]">Mot de passe</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="bg-transparent outline-none text-lg placeholder:text-stone-200"
                    />
                  </div>
                </div>


                <div className="bg-[#0F0F0F] p-6 space-y-4 rounded-sm">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-2xl font-serif italic tracking-[0.4em] text-[#B38B59] select-none line-through decoration-white/20">
                      {captchaCode}
                    </span>
                    <button 
                      type="button" 
                      onClick={generateCaptcha} 
                      className="text-[8px] uppercase tracking-widest text-white/40 hover:text-[#B38B59] transition-colors"
                    >
                      Actualiser ⟳
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Entrez le code de sécurité"
                    className="w-full bg-white/5 border border-white/5 text-center text-white text-xs tracking-[0.2em] uppercase p-3 outline-none focus:border-[#B38B59]/50 transition-all"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-6 pt-4">
                  <button className="w-full bg-[#0F0F0F] text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-[#B38B59] transition-all duration-500 shadow-xl">
                    Connexion
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep("forgot")} 
                    className="text-[9px] uppercase tracking-[0.3em] text-center opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            <div className="space-y-10 text-center animate-in fade-in duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl font-serif text-[#0F0F0F] italic">Récupération</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#B38B59] font-bold leading-relaxed">
                  Entrez votre email pour recevoir <br/> vos accès ROOMBOOK.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-8">
                <input 
                  type="email" 
                  required
                  className="w-full bg-transparent border-b border-[#0F0F0F]/10 py-4 outline-none text-center italic text-xl focus:border-[#B38B59] transition-all" 
                  placeholder="votre@email.com" 
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex flex-col gap-5">
                  <button className="w-full bg-[#0F0F0F] text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#B38B59] transition-all shadow-lg">
                    Envoyer le lien
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep("login")} 
                    className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            </div>
          )}

          
          <div className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40">
              Nouveau sur la plateforme ? {" "}
              <Link to="/register" className="text-[#B38B59] font-bold hover:underline transition-all">Créer un compte</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}