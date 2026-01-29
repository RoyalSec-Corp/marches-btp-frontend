import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiMoneyDollarCircleLine } from "react-icons/ri";

const FacturePage = () => {
  const [searchParams] = useSearchParams();
  const [facture, setFacture] = useState(null);
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:3002/api/payments/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Session Stripe récupérée :", data);
          setFacture(data);
        })
        .catch((err) => console.error("❌ Erreur récupération facture :", err));
    }
  }, [sessionId]);

  if (!facture)
    return <p className="text-center mt-10 text-gray-600">Chargement de la facture...</p>;

  // --- Lecture des métadonnées Stripe ---
  const metadata = facture.metadata || {};
  const client = metadata.client ? JSON.parse(metadata.client) : {};
  const vendeur = metadata.vendeur ? JSON.parse(metadata.vendeur) : {};

  // --- Données financières ---
  const montantTTC = facture.amount_total / 100;
  const tauxTVA = 20;
  const montantHT = montantTTC / (1 + tauxTVA / 100);
  const totalTVA = montantTTC - montantHT;

  // --- Reconstitution de la facture complète ---
  const factureData = {
    numero: metadata.factureId || `FAC-${facture.id}`,
    date: new Date(facture.created * 1000).toLocaleDateString("fr-FR"),
    description: metadata.description || "Prestation de service",
    duree: metadata.duree || "Non précisée",
    appelOffreId: metadata.appelOffreId || "N/A",
    montantHT: montantHT.toFixed(2),
    totalTVA: totalTVA.toFixed(2),
    montantTTC: montantTTC.toFixed(2),
    client,
    vendeur,
  };

  return (
    <div className="px-6 py-8">
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/dashbord-appels-offre")}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <RiArrowLeftLine className="mr-2" />
        Retour au tableau de bord
      </button>

      {/* Carte facture */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
        {/* En-tête */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RiMoneyDollarCircleLine className="text-green-600" />
          Facture – Appel d’offre : {factureData.description}
        </h1>

        {/* --- Informations Client / Vendeur --- */}
        <div className="border-t border-gray-200 mt-4 pt-4 grid grid-cols-2 gap-6 text-sm">
          {/* Prestataire */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Prestataire</h2>
            <p>{factureData.vendeur.nom}</p>
            <p>{factureData.vendeur.adresse}</p>
            <p>{factureData.vendeur.email}</p>
          </div>

          {/* Client */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Client</h2>
            <p>{factureData.client.prenom} {factureData.client.nom}</p>
            <p>{factureData.client.adresse}</p>
            <p>{factureData.client.code_postal}</p>
            <p>{factureData.client.email}</p>
          </div>
        </div>

        {/* --- Infos facture --- */}
        <div className="mt-6 text-sm">
          <p><strong>Numéro de facture :</strong> {factureData.numero}</p>
          <p><strong>Date de facturation :</strong> {factureData.date}</p>
          <p><strong>Durée :</strong> {factureData.duree}</p>
        </div>

        {/* --- Tableau facture --- */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-center">Durée</th>
                <th className="border p-2 text-center">Prix HT (€)</th>
                <th className="border p-2 text-center">% TVA</th>
                <th className="border p-2 text-center">Total TVA (€)</th>
                <th className="border p-2 text-center">Total TTC (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{factureData.description}</td>
                <td className="border p-2 text-center">{factureData.duree}</td>
                <td className="border p-2 text-center">{factureData.montantHT}</td>
                <td className="border p-2 text-center">{tauxTVA}%</td>
                <td className="border p-2 text-center">{factureData.totalTVA}</td>
                <td className="border p-2 text-center font-semibold">{factureData.montantTTC}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- Totaux --- */}
        <div className="mt-4 text-sm">
          <p><strong>Total HT :</strong> {factureData.montantHT} €</p>
          <p><strong>Total TVA ({tauxTVA}%) :</strong> {factureData.totalTVA} €</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            Total TTC : {factureData.montantTTC} €
          </p>
        </div>

        {/* --- Actions --- */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`http://localhost:3002/api/payments/invoice-pdf/${sessionId}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center"
          >
            Télécharger la facture PDF
          </a>
          <button
            onClick={() => navigate("/dashbord-appels-offre")}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 text-center"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturePage;