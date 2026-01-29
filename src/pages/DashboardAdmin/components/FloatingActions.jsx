// src/pages/DashboardAdmin/components/FloatingActions.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  RiAlertLine,
  RiBuildingLine,
  RiExchangeFundsLine,
  RiCheckboxCircleLine,
  RiAddLine,
  RiTimeLine,
  RiFundsLine,
  RiRadarLine,
  RiErrorWarningLine,
  RiUserAddLine,
  RiMegaphoneLine,
  RiFileChartLine,
  RiSearchLine,
} from 'react-icons/ri';

function FloatingActions() {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showQuickValidate, setShowQuickValidate] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const alertsRef = useRef(null);
  const quickRef = useRef(null);
  const addRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) setShowAlerts(false);
      if (quickRef.current && !quickRef.current.contains(e.target)) setShowQuickValidate(false);
      if (addRef.current && !addRef.current.contains(e.target)) setShowAddMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      {/* 🔴 Alertes critiques */}
      <div ref={alertsRef} className="relative">
        {showAlerts && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Alertes Critiques</h3>
            </div>
            <div className="py-2">
              <div className="flex items-center px-4 py-3 border-l-4 border-red-500 hover:bg-gray-50 space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <RiErrorWarningLine className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">5 litiges urgents non résolus</p>
                  <p className="text-xs text-gray-500">Il y a 15 min</p>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 border-l-4 border-orange-500 hover:bg-gray-50 space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <RiTimeLine className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">8 entreprises en attente &gt; 48h</p>
                  <p className="text-xs text-gray-500">Validation requise</p>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 border-l-4 border-yellow-500 hover:bg-gray-50 space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <RiFundsLine className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">3 transactions bloquées</p>
                  <p className="text-xs text-gray-500">Montant : €12,500</p>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 border-l-4 border-blue-500 hover:bg-gray-50 space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RiRadarLine className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Erreur scraping BOAMP</p>
                  <p className="text-xs text-gray-500">Interrompu depuis 1h</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className="w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 flex items-center justify-center"
        >
          <RiAlertLine className="text-xl" />
        </button>
      </div>

      {/* ✅ Validation rapide */}
      <div ref={quickRef} className="relative">
        {showQuickValidate && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="py-2">
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiBuildingLine />
                <span>Valider toutes les entreprises</span>
              </button>
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiExchangeFundsLine />
                <span>Approuver les transactions</span>
              </button>
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiCheckboxCircleLine />
                <span>Marquer litiges résolus</span>
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowQuickValidate(!showQuickValidate)}
          className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center"
        >
          <RiCheckboxCircleLine className="text-xl" />
        </button>
      </div>

      {/* ➕ Bouton + → Menu contextuel */}
      <div ref={addRef} className="relative">
        {showAddMenu && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="py-2">
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiUserAddLine />
                <span>Ajouter un utilisateur</span>
              </button>
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiMegaphoneLine />
                <span>Publier une alerte</span>
              </button>
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiFileChartLine />
                <span>Générer un rapport</span>
              </button>
              <button className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-50 text-gray-700 space-x-2">
                <RiSearchLine />
                <span>Rechercher un utilisateur</span>
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <RiAddLine className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default FloatingActions;