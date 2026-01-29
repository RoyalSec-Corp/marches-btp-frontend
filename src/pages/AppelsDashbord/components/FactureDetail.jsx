import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import axios from "axios";

const FactureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/api/payments/invoice/${id}`);
        setFacture(res.data);
      } catch (err) {
        console.error("Erreur récupération facture:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacture();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-blue-600">
        Chargement...
      </div>
    );

  if (!facture)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Facture introuvable.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg relative">
        {/* --- Bouton Retour --- */}
        <button
          onClick={() => navigate("/dashbord-appels-offre")}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <RiArrowLeftLine className="mr-2" />
          Retour sur le tableau de bord 
        </button>

        {/* --- Contenu de la facture --- */}
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Facture n° {facture.numero}
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Vendeur</h2>
            <p>{facture.vendeur?.nom}</p>
            <p>{facture.vendeur?.adresse}</p>
            <p>{facture.vendeur?.email}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Client</h2>
            <p>{facture.client?.prenom} {facture.client?.nom}</p>
            <p>{facture.client?.adresse}</p>
            <p>{facture.client?.code_postal}</p>
            <p>{facture.client?.email}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Détails</h3>
        <p><strong>Description :</strong> {facture.description}</p>
        <p><strong>Durée :</strong> {facture.duree}</p>
        <p><strong>Date :</strong> {facture.date}</p>

        <div className="mt-8 border-t pt-4">
          <p>Total HT : <strong>{facture.montantHT} €</strong></p>
          <p>TVA (20%) : <strong>{facture.totalTVA} €</strong></p>
          <p>Total TTC : <strong className="text-blue-700 text-lg">{facture.montantTTC} €</strong></p>
        </div>

        <div className="mt-8 text-right">
          <a
            href={`http://localhost:3002/api/payments/invoice-pdf/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Télécharger le PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default FactureDetail;