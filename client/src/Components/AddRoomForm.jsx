import { useState } from "react";

const WILAYAS = [
  "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar", 
  "09 Blida", "10 Bouira", "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger", 
  "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma", 
  "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla", "31 Oran", "32 El Bayadh", 
  "33 Illizi", "34 Bordj Bou Arreridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued", 
  "40 Khenchela", "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", 
  "47 Ghardaïa", "48 Relizane", "49 El M'Ghair", "50 El Meniaa", "51 Ouled Djellal", "52 Bordj Baji Mokhtar", 
  "53 Béni Abbès", "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
];

export default function AddRoomForm({ isOpen, onClose }) {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Conférence",
    wilaya: "",
    capacity: "",
    price: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nouvel espace enregistré :", { ...formData, images });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/90 backdrop-blur-sm p-4">
      <div className="bg-[#F9F6F2] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <div className="sticky top-0 bg-[#F9F6F2] z-10 p-8 border-b border-[#0F0F0F]/5 flex justify-between items-center">
          <h2 className="text-3xl font-serif italic text-[#0F0F0F]">Nouvel Espace</h2>
          <button onClick={onClose} className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">Fermer ✕</button>
        </div>

        <form className="p-8 md:p-12 space-y-12" onSubmit={handleSubmit}>
          
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
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Salon Signature" 
                  className="bg-transparent outline-none italic text-lg text-[#0F0F0F]" 
                  required
                />
              </div>

              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Wilaya</label>
                <select 
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none italic text-[#0F0F0F]"
                  required
                >
                  <option value="">Sélectionner</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Type d'espace</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none italic text-[#0F0F0F]"
                >
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
                  <input 
                    type="number" 
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="50" 
                    className="bg-transparent outline-none italic text-[#0F0F0F]" 
                  />
                </div>
                <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Prix / Jour (DZD)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="12000" 
                    className="bg-transparent outline-none italic font-bold text-[#0F0F0F]" 
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col border-b border-[#0F0F0F]/10 py-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2" 
                  placeholder="Décrivez l'ambiance..." 
                  className="bg-transparent outline-none italic text-sm resize-none text-[#0F0F0F]"
                ></textarea>
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