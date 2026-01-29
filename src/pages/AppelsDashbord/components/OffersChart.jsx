// src/pages/AppelsDashbord/components/OffersChart.jsx
import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import callsForTendersApi from '../../../services/callsForTendersApi';

function OffersChart() {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ months: [], callsData: [], applicationsData: [] });

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await callsForTendersApi.getStatistics();
      
      // Traiter les données mensuelles
      const monthlyData = stats.monthly_data || [];
      
      // Inverser l'ordre pour avoir les mois les plus récents à droite
      const reversedData = [...monthlyData].reverse();
      
      // Formater les mois pour l'affichage
      const months = reversedData.map(item => {
        if (!item.month) return 'N/A';
        const date = new Date(item.month);
        return date.toLocaleDateString('fr-FR', { 
          month: 'short',
          year: '2-digit'
        });
      });

      const callsData = reversedData.map(item => item.calls_created || 0);
      const applicationsData = reversedData.map(item => item.applications_received || 0);

      setChartData({ months, callsData, applicationsData });
    } catch (err) {
      console.error('Erreur lors du chargement des données du graphique:', err);
      setError('Impossible de charger les données du graphique');
      
      // Utiliser des données par défaut en cas d'erreur
      setChartData({
        months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        callsData: [15, 22, 18, 24, 19, 28],
        applicationsData: [8, 15, 12, 18, 14, 22]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    
    const option = {
      animation: false,
      grid: { top: 40, right: 10, bottom: 30, left: 40 },
      legend: {
        top: 5,
        textStyle: { color: '#6b7280', fontSize: 12 }
      },
      xAxis: {
        type: 'category',
        data: chartData.months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'AO Créés',
          data: chartData.callsData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { color: 'rgba(87, 181, 231, 1)', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(87, 181, 231, 0.1)' },
                { offset: 1, color: 'rgba(87, 181, 231, 0.01)' }
              ]
            }
          }
        },
        {
          name: 'Candidatures',
          data: chartData.applicationsData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { color: 'rgba(251, 191, 114, 1)', width: 2 }
        }
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
        formatter: function (params) {
          const month = params[0].axisValue;
          let tooltip = `<strong>${month}</strong><br/>`;
          params.forEach(param => {
            tooltip += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
          });
          return tooltip;
        }
      }
    };

    myChart.setOption(option);

    const resizeHandler = () => myChart.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      myChart.dispose();
    };
  }, [chartData, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution des Appels d'Offres
        </h3>
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution des Appels d'Offres
        </h3>
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchChartData}
              className="bg-primary text-white px-4 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Appels d'Offres</h3>
      <div ref={chartRef} style={{ height: '300px' }}></div>
    </div>
  );
}

export default OffersChart;
