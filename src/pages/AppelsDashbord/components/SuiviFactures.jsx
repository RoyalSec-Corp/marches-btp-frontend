import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Paiement = () => {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
  const fetchFactures = async () => {
    try {
      const token = localStorage.getItem("token"); // ou ton gestionnaire d’auth
      const res = await axios.get("http://localhost:3002/api/payments/successful", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur chargement factures:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchFactures();
}, []);

  if (loading) {
    return (
      <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white min-h-screen flex justify-center items-center">
        <p>Chargement des paiements en cours...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Historique de vos paiements</h1>

      {factures.length === 0 ? (
        <p className="text-lg">Aucun paiement enregistré pour le moment.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg text-gray-800">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-left">Client (Email)</th>
                <th className="px-4 py-3 text-left">Prestataire (Email)</th>
                <th className="px-4 py-3 text-left">Facture ID</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{f.date}</td>
                  <td className="px-4 py-3">{f.description}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {f.montant} {f.devise}
                  </td>
                  <td className="px-4 py-3">{f.clientEmail}</td>
                  <td className="px-4 py-3">{f.vendeurEmail}</td>
                  <td className="px-4 py-3">{f.factureId}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/facture/${f.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Voir la facture
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Paiement;