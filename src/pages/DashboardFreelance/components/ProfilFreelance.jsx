import React, { useState, useEffect } from 'react';
import authApi from '../../../services/authApi';

function ProfilFreelance() {
  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '', ville: '', adresse: '', code_postal: '', daily_rate: 0, hourly_rate: 0, secteur: '', experience: 0, description: '', disponibilites: { Lundi: 'Disponible', Mardi: 'Disponible', Mercredi: 'Disponible', Jeudi: 'Disponible', Vendredi: 'Disponible', Samedi: 'Indisponible', Dimanche: 'Indisponible' } });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try { setLoading(true); const data = await authApi.me(); const user = data.user; setProfil({ nom: user.nom || '', prenom: user.prenom || '', email: user.email || '', telephone: user.telephone || '', ville: user.ville || '', adresse: user.adresse || '', code_postal: user.code_postal || '', daily_rate: user.daily_rate || 0, hourly_rate: user.hourly_rate || 0, secteur: user.secteur || '', experience: user.experience || 0, description: user.description || '', disponibilites: { Lundi: 'Disponible', Mardi: 'Disponible', Mercredi: 'Disponible', Jeudi: 'Disponible', Vendredi: 'Disponible', Samedi: 'Indisponible', Dimanche: 'Indisponible', ...user.disponibilites } }); } catch (err) { setError('Erreur lors du chargement du profil'); console.error('Erreur:', err); } finally { setLoading(false); }
  };

  const handleChange = (e) => { const { name, value } = e.target; setProfil((prev) => ({ ...prev, [name]: value })); };
  const handleDispoChange = (day, value) => { setProfil((prev) => ({ ...prev, disponibilites: { ...prev.disponibilites, [day]: value } })); };

  const handleSave = async () => {
    try { setLoading(true); const profilData = { ...profil, daily_rate: profil.daily_rate || 0, hourly_rate: profil.hourly_rate || 0, experience: profil.experience || 0 }; await authApi.updateFreelanceProfile(profilData); await loadProfile(); setMessage('\u2705 Modifications enregistrees avec succes.'); setTimeout(() => setMessage(''), 3000); } catch (err) { setError('Erreur lors de l\'enregistrement du profil'); console.error('Erreur:', err); } finally { setLoading(false); }
  };

  if (loading) return (<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-6"><div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">{profil.prenom?.charAt(0)}{profil.nom?.charAt(0)}</div><h3 className="text-xl font-semibold text-white">{profil.prenom} {profil.nom}</h3><p className="text-white">{profil.secteur || 'Professionnel BTP'}</p><div className="flex items-center justify-center mt-3 space-x-1 text-yellow-400 text-sm"><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-half-fill"></i><span className="ml-2 text-gray-600 text-sm text-white">4.8 (24 avis)</span></div></div>
        <div className="space-y-4 text-sm text-gray-700">
          <div><label className="block mb-1 font-medium text-white">Tarif journalier</label><div className="flex items-center space-x-2"><input type="number" name="daily_rate" value={profil.daily_rate} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" /><span className="px-2 py-2 text-sm text-white">\u20ac/jour</span></div></div>
          <div><label className="block mb-1 font-medium text-white">Disponibilites</label><div className="space-y-1">{Object.entries(profil.disponibilites).map(([day, value]) => (<div key={day} className="flex justify-between items-center"><span className="text-white">{day}</span><select value={value} onChange={(e) => handleDispoChange(day, e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1"><option value="Disponible">Disponible</option><option value="Indisponible">Indisponible</option></select></div>))}</div></div>
        </div>
      </div>
      <div className="md:col-span-2 space-y-6">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-orange-400 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><label className="block mb-1 font-medium text-white">Prenom</label><input type="text" name="prenom" value={profil.prenom} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Nom</label><input type="text" name="nom" value={profil.nom} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Email</label><input type="email" name="email" value={profil.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Telephone</label><input type="tel" name="telephone" value={profil.telephone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Adresse</label><input type="text" name="adresse" value={profil.adresse} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Code postal</label><input type="text" name="code_postal" value={profil.code_postal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Ville</label><input type="text" name="ville" value={profil.ville} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Secteur d'activite</label><input type="text" name="secteur" value={profil.secteur} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
            <div><label className="block mb-1 font-medium text-white">Annees d'experience</label><input type="number" name="experience" value={profil.experience} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
          </div>
          <div className="mt-4"><label className="block mb-1 font-medium text-white">Description</label><textarea name="description" value={profil.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24" placeholder="Decrivez vos competences et votre experience..." /></div>
        </div>
        <div className="text-right"><button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 hover:to-blue-500 transition-all duration-300 whitespace-nowrap text-white px-6 py-2 rounded-lg font-medium">{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}</button>{message && <p className="text-green-600 mt-2 text-sm">{message}</p>}{error && <p className="text-red-600 mt-2 text-sm">{error}</p>}</div>
      </div>
    </div>
  );
}

export default ProfilFreelance;
