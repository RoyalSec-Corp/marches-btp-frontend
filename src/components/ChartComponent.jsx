import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ChartComponent = ({ options, style }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(options);
      window.addEventListener('resize', () => {
        chartInstance.current.resize();
      });
    }
  }, [options]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px', ...style }} />;
};

export default ChartComponent;
