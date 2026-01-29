import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const StatistiquesAdmin = ({ stats }) => {
  
  // 1. Sécurité : Si les données ne sont pas encore chargées
  if (!stats) return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center text-gray-400">
       Chargement des graphiques...
    </div>
  );

  // 2. Connexion aux données de la BDD (envoyées par le Backend)
  // Si la table est vide, on utilise un tableau vide [] pour ne pas faire planter
  const activityData = stats.activity || [];
  const revenueData = stats.revenue || [];

  // 3. Infobulle personnalisée au survol
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs">
          <p className="font-bold text-gray-700 mb-1">{label}</p>
          <p className="text-primary font-medium">
            {payload[0].value} {payload[0].name === 'montant' ? '€' : 'inscrits'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 h-full">
      
      {/* --- GRAPHIQUE 1 : ACTIVITÉ (Inscriptions par mois) --- */}
      {/* Connecté à la requête SQL : SELECT ... FROM users ... */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wide flex items-center">
          📈 Inscriptions (6 derniers mois)
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="inscriptions" name="inscrits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- GRAPHIQUE 2 : REVENUS (Area Chart) --- */}
      {/* Connecté à la requête SQL : SELECT ... FROM payments ... */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
          💰 Revenus Générés
        </h3>
        <div className="h-[250px] w-full">
           {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="montant" 
                  name="montant"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenu)" 
                />
              </AreaChart>
            </ResponsiveContainer>
           ) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm italic">
                 Aucun paiement enregistré dans la base de données
              </div>
           )}
        </div>
      </div>

    </div>
  );
};

export default StatistiquesAdmin;