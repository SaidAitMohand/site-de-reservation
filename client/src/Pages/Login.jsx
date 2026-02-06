import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [Step, SetStep] = useState("login");

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captchaInput.toUpperCase() !== captchaCode) {
      alert("Code de sécurité incorrect.");
      generateCaptcha();
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur de connexion");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      alert("Connexion réussie !");
      window.location.href = "/";

    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] selection:bg-[#B38B59] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-[480px] bg-white border border-[#0F0F0F]/5 p-10 md:p-16 shadow">

          <div className="space-y-12">

            <div className="text-center space-y-3">
              <h1 className="text-4xl font-serif italic">Se connecter</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">

              <div className="space-y-6">

                <div className="flex flex-col border-b py-2">
                  <label className="text-[9px] uppercase opacity-40 font-bold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre username"
                    className="bg-transparent outline-none text-lg italic"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="flex flex-col border-b py-2">
                  <label className="text-[9px] uppercase opacity-40 font-bold mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-lg"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

              </div>

              <div className="bg-[#0F0F0F] p-6 space-y-4 rounded-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-2xl font-serif italic text-[#B38B59]">
                    {captchaCode}
                  </span>
                  <button type="button" onClick={generateCaptcha} className="text-white/40">
                    Actualiser ⟳
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Entrez le code"
                  className="w-full bg-white/5 text-white text-center p-3 outline-none"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>

              <button className="w-full bg-[#0F0F0F] text-white py-4 uppercase font-bold hover:bg-[#B38B59]">
                Connexion
              </button>

            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] uppercase opacity-40">
                Nouveau ?{" "}
                <Link to="/register" className="text-[#B38B59] font-bold">
                  Créer un compte
                </Link>
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
