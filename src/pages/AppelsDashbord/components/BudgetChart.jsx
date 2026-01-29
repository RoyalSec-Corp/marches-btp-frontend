import React, { useEffect, useState } from "react";
// Plus besoin d'importer echarts ici, ChartComponent s'en charge !
import callsForTendersApi from "../../../services/callsForTendersApi";
import ChartComponent from '../../../components/ChartComponent';

const BudgetChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await callsForTendersApi.getStatistics();
      
      const budgetData = stats.budget_distribution || [];
      
      const colors = [
        "rgba(87, 181, 231, 1)",
        "rgba(141, 211, 199, 1)",
        "rgba(251, 191, 114, 1)",
        "rgba(252, 141, 98, 1)",
        "rgba(188, 128, 189, 1)"
      ];

      const formattedData = budgetData.map((item, index) => ({
        value: item.count || item.value || 0,
        name: item.range,
        itemStyle: {
          color: colors[index % colors.length],
          borderRadius: 8,
        },
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error('Erreur lors du chargement des données budget:', err);
      setError('Impossible de charger les données de budget');
      
      // Données de secours
      setChartData([
        { value: 35, name: "< 100 000 €", itemStyle: { color: "rgba(87, 181, 231, 1)", borderRadius: 8 } },
        { value: 28, name: "100 000 € - 500 000 €", itemStyle: { color: "rgba(141, 211, 199, 1)", borderRadius: 8 } },
        { value: 22, name: "500 000 € - 1M €", itemStyle: { color: "rgba(251, 191, 114, 1)", borderRadius: 8 } },
        { value: 15, name: "> 1M €", itemStyle: { color: "rgba(252, 141, 98, 1)", borderRadius: 8 } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Configuration des options du graphique
  const options = {
    animation: true, // On remet l'animation, c'est plus joli
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      textStyle: { color: "#1f2937" },
      formatter: function (params) {
        // Calcul du pourcentage manuel pour le tooltip
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
        return `${params.name}<br/>${params.value} AO (${percentage}%)`;
      }
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        data: chartData,
        label: {
          color: "#1f2937",
          fontSize: 12,
        },
        labelLine: {
          lineStyle: { color: "#d1d5db" },
        },
      },
    ],
  };

  // --- RENDU ---

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Budget</h3>
        <div className="flex items-center justify-center" style={{ height: "300px" }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Budget</h3>
        <div className="flex items-center justify-center text-red-500" style={{ height: "300px" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Répartition par Budget
      </h3>
      {/* On utilise notre composant stable ici ! */}
      <ChartComponent options={options} style={{ height: "300px" }} />
    </div>
  );
};

export default BudgetChart;