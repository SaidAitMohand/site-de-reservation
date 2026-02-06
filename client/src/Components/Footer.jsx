export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-24 px-12 border-t border-white/5 font-serif">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 opacity-60">
        <div className="max-w-xs text-[10px] uppercase tracking-[0.2em] leading-loose">
          <p className="text-xl tracking-[0.5em] mb-6 font-light">RÉSERVE D'OR</p>
          <p>Le privilège de l'élégance pour chaque étape de la vie. Conciergerie privée opérant sur les 58 wilayas d'Algérie.</p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold space-y-4">
          <p>© 2026 - L'Excellence à votre portée</p>
          <div className="flex gap-6 mt-4">
            <a href="#" className="hover:text-[#D4AF37]">Instagram</a>
            <a href="#" className="hover:text-[#D4AF37]">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}