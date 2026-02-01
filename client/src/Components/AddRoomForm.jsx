import { useState } from "react";

export default function AddRoomForm({ isOpen, onClose }) {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
      <div className="bg-[#F9F6F2] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <div className="sticky top-0 bg-[#F9F6F2] z-10 p-8 border-b border-[#0F0F0F]/5 flex justify-between items-center">
          <h2 className="text-3xl font-serif italic text-[#0F0F0F]">Nouvel Espace</h2>
          <button onClick={onClose} className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">Fermer ✕</button>
        </div>

        <form className="p-8 md:p-12 space-y-12" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#B38B59] font-bold">Galerie de l'espace</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((src, i) => (
                <div key={i} className="aspect-square bg-stone-200 overflow-hidden relative group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-red-500/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-bold uppercase"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#B38B59] transition-colors">
                <span className="text-2xl opacity-30">+</span>
                <span className="text-[9px] uppercase tracking-widest opacity-40 mt-2">Ajouter Photo</span>
                <input type="file" multiple onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#B38B59] font-bold">Détails</p>
              
              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Nom de la salle</label>
                <input type="text" placeholder="Ex: Salon Signature" className="bg-transparent outline-none italic text-lg text-[#0F0F0F]" />
              </div>

              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Type d'espace</label>
                <select className="bg-transparent outline-none italic text-[#0F0F0F]">
                  <option>Conférence</option>
                  <option>Mariage / Fêtes</option>
                  <option>Coworking</option>
                  <option>Réunion Privée</option>
                  <option>Shooting</option>
                  <option>Dîner Privé</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#B38B59] font-bold">Capacité & Prix</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Capacité (Pers.)</label>
                  <input type="number" placeholder="50" className="bg-transparent outline-none italic text-[#0F0F0F]" />
                </div>
                <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Prix / Jour (DZD)</label>
                  <input type="number" placeholder="12000" className="bg-transparent outline-none italic font-bold text-[#0F0F0F]" />
                </div>
              </div>

              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Description</label>
                <textarea rows="2" placeholder="Décrivez l'ambiance et les équipements..." className="bg-transparent outline-none italic text-sm resize-none text-[#0F0F0F]"></textarea>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" className="w-full bg-[#0F0F0F] text-white py-6 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-[#B38B59] transition-all duration-500 shadow-2xl">
              Publier l'annonce sur ROOMBOOK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}