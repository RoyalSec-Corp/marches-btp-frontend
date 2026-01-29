import React from "react";
import { RiArrowLeftLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { useAuth } from "../../../context/AuthContext";

const FactureAppelOffre = ({ data, onBack }) => {
  const { user } = useAuth();
  if (!data) return null;

  const { appel_offre, freelance, budget_propose, duree_proposee , candidat} = data;


  // 🕵️‍♂️ Ajoute ce log ici pour inspecter ce que tu reçois
  console.log("🧾 Données candidat :", candidat);

  // Simuler les données
  const factureData = {
    numero: `FAC-${appel_offre?.id}-${data.id}`,
    date: new Date().toLocaleDateString("fr-FR"),
    montantHT: budget_propose || 0,
    duree: duree_proposee || "Non spécifiée",
    client: {
      nom: user?.nom || "Nom",
      prenom: user?.prenom || "Prénom",
      adresse: user?.adresse || "Adresse non renseignée",
      code_postal: user?.code_postal || "Code postal non renseigné",
      email: user?.email || "Email non renseigné",

    },
    vendeur: {
      nom: candidat?.nom_complet || candidat?.raison_sociale || "Client inconnu",
      adresse: candidat?.adresse_complete || 
            `${candidat?.adresse || ""}, ${candidat?.code_postal || ""} ${candidat?.ville || ""}`.trim() || "Adresse non fournie",
      email: candidat?.email || "Email non fourni"
    },
  };

  const montantTTC = Number(budget_propose || 0); // prix unitaire TTC
  const tauxTVA = 20; // %
  const montantHT = montantTTC / (1 + tauxTVA / 100); // HT = TTC / 1.2
  const totalTVA = montantTTC - montantHT; // TVA = TTC - HT

  return (
    <div className="px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <RiArrowLeftLine className="mr-2" />
        Retour aux candidatures
      </button>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
        {/* --- En-tête --- */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RiMoneyDollarCircleLine className="text-green-600" />
          Facture – Appel d’offre : {appel_offre?.titre}
        </h1>

        {/* --- Informations facture --- */}
        <div className="border-t border-gray-200 mt-4 pt-4 grid grid-cols-2 gap-6 text-sm">
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Prestataire</h2>
            <p>{factureData.vendeur.prenom} {factureData.vendeur.nom}</p>
            <p>{factureData.vendeur.adresse}</p>
            <p>{factureData.vendeur.email}</p>
            
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Client</h2>
            <p>{factureData.client.nom}</p><p>{factureData.client.prenom}</p>
            <p>{factureData.client.adresse}</p>
            <p>{factureData.client.code_postal}</p>
            <p>{factureData.client.email}</p>
          </div>
        </div>

        {/* --- Infos facture --- */}
        <div className="mt-6 text-sm">
          <p><strong>Numéro de facture :</strong> {factureData.numero}</p>
          <p><strong>Date de facturation :</strong> {factureData.date}</p>
        </div>

        {/* --- Tableau facture --- */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-center">Durée</th>
                <th className="border p-2 text-center">Prix unitaire HT (€)</th>
                <th className="border p-2 text-center">% TVA</th>
                <th className="border p-2 text-center">Total TVA (€)</th>
                <th className="border p-2 text-center">Total TTC (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{appel_offre?.titre || "Projet sans titre"}</td>
                <td className="border p-2 text-center">{factureData.duree}</td>
                <td className="border p-2 text-center">{montantHT.toFixed(2)}</td>
                <td className="border p-2 text-center">{tauxTVA}%</td>
                <td className="border p-2 text-center">{totalTVA.toFixed(2)}</td>
                <td className="border p-2 text-center font-semibold">{montantTTC.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- Résumé total --- */}
        <p><strong>Total HT :</strong> {montantHT.toFixed(2)} €</p>
        <p><strong>Total TVA ({tauxTVA}%) :</strong> {totalTVA.toFixed(2)} €</p>
        <p className="text-lg font-bold text-gray-900 mt-2">
          Total TTC : {montantTTC.toFixed(2)} €
        </p>

        {/* --- Paiement --- */}
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:3002/api/payments/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                  montant: montantTTC,
                  description: `Paiement pour ${appel_offre?.titre}`,
                  factureId: factureData.numero,
                  client: factureData.client,
                  vendeur: factureData.vendeur,
                  appelOffreId: appel_offre?.id,
                  duree: factureData.duree
                }),
              });

                const resData = await response.json();
                if (resData.url) {
                  window.location.href = resData.url;
                } else {
                  alert("Erreur : impossible de démarrer le paiement.");
            }
              } catch (error) {
              console.error(error);
              alert("Erreur lors du paiement.");
              }
        }}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Procéder au paiement
        </button>
        </div>
      </div>
    </div>
  );
};

export default FactureAppelOffre;