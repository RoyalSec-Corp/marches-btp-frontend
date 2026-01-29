import React, { useState, useEffect } from "react";
import { RiFileList3Line, RiMailLine, RiTimeLine, RiCheckDoubleLine } from "react-icons/ri";
import callsForTendersApi from "../../../services/callsForTendersApi";

const StatCards = () => {
  const [statistics, setStatistics] = useState({
    active_calls: 0,
    total_applications: 0,
    active_projects: 0,
    completed_projects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        console.log('📊 StatCards - Chargement des statistiques...');
        const data = await callsForTendersApi.getStatistics();
        console.log('📊 StatCards - Statistiques reçues:', data);
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('❌ StatCards - Erreur lors du chargement des statistiques:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    {
      icon: <RiFileList3Line className="text-primary text-xl" />,
      bg: "bg-blue-100",
      growth: loading ? "..." : "+12%",
      growthColor: "text-green-600 bg-green-50",
      value: loading ? "..." : statistics.active_calls.toString(),
      label: "Appels d'offres actifs",
    },
    {
      icon: <RiMailLine className="text-secondary text-xl" />,
      bg: "bg-green-100",
      growth: loading ? "..." : "+8%",
      growthColor: "text-green-600 bg-green-50",
      value: loading ? "..." : statistics.total_applications.toString(),
      label: "Propositions reçues",
    },
    {
      icon: <RiTimeLine className="text-orange-500 text-xl" />,
      bg: "bg-orange-100",
      growth: loading ? "..." : "En cours",
      growthColor: "text-blue-600 bg-blue-50",
      value: loading ? "..." : statistics.active_projects.toString(),
      label: "Projets en cours",
    },
    {
      icon: <RiCheckDoubleLine className="text-purple-500 text-xl" />,
      bg: "bg-purple-100",
      growth: loading ? "..." : "Ce mois",
      growthColor: "text-gray-500",
      value: loading ? "..." : statistics.completed_projects.toString(),
      label: "Projets terminés",
    },
  ];

  if (error) {
    console.error('❌ StatCards - Affichage avec erreur:', error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <span className={`text-sm ${stat.growthColor} px-2 py-1 rounded-full`}>
              {stat.growth}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
