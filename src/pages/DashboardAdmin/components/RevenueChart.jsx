// src/pages/DashboardAdmin/components/RevenueChart.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';

function RevenueChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e5e7eb',
        },
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Revenus',
        data: [85000, 92000, 78000, 105000, 98000, 115000],
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#3b82f6',
          width: 3,
        },
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus Mensuels</h3>
      <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />
    </div>
  );
}

export default RevenueChart;