import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiUserLine, RiMapPinLine, RiCalendarLine, RiMoneyDollarCircleLine, RiFileTextLine } from 'react-icons/ri';

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const contrat = location.state;

  if (!contrat) return (<div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6"><div className="max-w-4xl mx-auto bg-white/10 rounded-xl p-8 text-center"><p className="text-white text-lg">Aucun contrat selectionne</p><button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Retour</button></div></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-white mb-6 hover:text-orange-400 transition-colors"><RiArrowLeftLine className="mr-2" />Retour</button>
        <div className="bg-white/10 rounded-xl p-8 border border-white/20">
          <div className="flex items-start justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-white mb-2">{contrat.title}</h1><span className={`px-3 py-1 rounded-full text-sm font-medium ${contrat.statut === 'completed' ? 'bg-green-100 text-green-800' : contrat.statut === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{contrat.status_display}</span></div>
            <div className="text-right"><p className="text-2xl font-bold text-orange-400">{contrat.budget_formatted}</p><p className="text-sm text-white/70">Budget</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center text-white"><RiUserLine className="mr-3 text-orange-400" /><div><p className="text-sm text-white/70">Freelance</p><p className="font-medium">{contrat.freelance_name || 'Non assigne'}</p></div></div>
              <div className="flex items-center text-white"><RiMapPinLine className="mr-3 text-orange-400" /><div><p className="text-sm text-white/70">Localisation</p><p className="font-medium">{contrat.freelance_location || contrat.localisation || 'Non specifie'}</p></div></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-white"><RiCalendarLine className="mr-3 text-orange-400" /><div><p className="text-sm text-white/70">Date de creation</p><p className="font-medium">{contrat.created_date_formatted}</p></div></div>
              {contrat.start_date_formatted && (<div className="flex items-center text-white"><RiCalendarLine className="mr-3 text-orange-400" /><div><p className="text-sm text-white/70">Date de debut</p><p className="font-medium">{contrat.start_date_formatted}</p></div></div>)}
            </div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center"><RiFileTextLine className="mr-2 text-orange-400" />Description</h2>
            <p className="text-white/80 leading-relaxed">{contrat.description || 'Aucune description disponible'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
