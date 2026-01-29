import React from 'react';

const GraphiquePlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4">
      <div className="text-gray-400 text-4xl mb-2">📊</div>
      <p className="text-gray-500 font-medium">Visualisation simplifiée</p>
      <p className="text-gray-400 text-sm">Les données sont traitées normalement.</p>
    </div>
  );
};

export default GraphiquePlaceholder;