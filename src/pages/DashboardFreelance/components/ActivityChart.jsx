import React, { useState, useEffect, useCallback } from 'react';
import ChartComponent from '../../../components/ChartComponent';
import contractsApi from '../../../services/contractsApi';

function ActivityChart({ autoRefreshMs = 30000 }) {
  const [chartData, setChartData] = useState({ labels: ['Sept', 'Oct', 'Nov', 'Dec', 'Jan'], data: [3200, 4100, 3800, 4500, 5200] });
  const [loading, setLoading] = useState(true);

  const loadEarningsData = useCallback(async () => {
    try {
      const data = await contractsApi.getFreelanceMonthlyEarnings();
      if (data) setChartData({ labels: data.labels || [], data: data.data || [] });
    } catch (error) { console.error('Erreur lors du chargement des donnees de revenus:', error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadEarningsData(); }, [loadEarningsData]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadEarningsData, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadEarningsData]);

  const option = {
    title: { text: 'Revenus mensuels', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' } },
    tooltip: { trigger: 'axis', textStyle: { color: '#fff' }, backgroundColor: 'rgba(0,0,0,0.7)' },
    xAxis: { type: 'category', data: chartData.labels, axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } } },
    series: [{ data: chartData.data, type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#f27024ff', width: 3 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(249, 5, 5, 0.1)' }, { offset: 1, color: 'rgba(233, 13, 13, 0.01)' }] } } }]
  };

  if (loading) return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div><div className="h-64 bg-gray-200 rounded"></div></div>);

  return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border border-gray-200 rounded-lg p-6 shadow-sm"><ChartComponent options={option} style={{ height: '300px', width: '100%' }} /></div>);
}

export default ActivityChart;
