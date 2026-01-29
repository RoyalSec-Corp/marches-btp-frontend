// src/pages/DashboardAdmin/components/DocumentViewer.jsx
import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

function DocumentViewer({ fileUrl, onClose }) {
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <RiCloseLine size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aperçu du document</h2>

        {isPdf ? (
          <iframe
            src={fileUrl}
            title="PDF Viewer"
            className="w-full h-[500px] border rounded"
          />
        ) : (
          <img
            src={fileUrl}
            alt="Document"
            className="w-full max-h-[500px] object-contain rounded"
          />
        )}
      </div>
    </div>
  );
}

export default DocumentViewer;