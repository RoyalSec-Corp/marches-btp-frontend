import React, { useState, useEffect, useCallback } from 'react';
import ChartComponent from '../../../components/ChartComponent';
import contractsApi from '../../../services/contractsApi';

function ActivityChart({ autoRefreshMs = 30000 }) {
  const [chartData, setChartData] = useState({ labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'], data: [5, 12, 8, 18, 15, 22] });
  const [loading, setLoading] = useState(true);

  const loadActivityData = useCallback(async () => { try { const data = await contractsApi.getEnterpriseActivity(); if (data) { setChartData({ labels: data.labels || [], data: data.data || [] }); } } catch (error) { console.error('Erreur:', error); } finally { setLoading(false); } }, []);

  useEffect(() => { loadActivityData(); }, [loadActivityData]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadActivityData, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadActivityData]);

  const option = {
    title: { text: 'Activite des appels d\'offres', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' } },
    tooltip: { trigger: 'axis', textStyle: { color: '#fff' }, backgroundColor: 'rgba(0,0,0,0.7)' },
    xAxis: { type: 'category', boundaryGap: false, data: chartData.labels, axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } } },
    series: [{ name: 'Appels publies', type: 'line', smooth: true, data: chartData.data, areaStyle: { color: '#3b82f6', opacity: 0.1 }, lineStyle: { color: '#f27024ff' }, symbol: 'circle', symbolSize: 8, label: { show: true, color: '#d78914ff' } }]
  };

  if (loading) return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border border-gray-200 rounded-lg p-6 shadow-sm mt-6 animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div><div className="h-64 bg-gray-200 rounded"></div></div>);

  return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border border-gray-200 rounded-lg p-6 shadow-sm mt-6"><ChartComponent options={option} style={{ height: '320px', width: '100%' }} /></div>);
}

export default ActivityChart;
