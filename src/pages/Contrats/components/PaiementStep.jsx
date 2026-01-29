import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { calculateContractFees, formatEuro, formatPercent } from "../../../utils/contractCalculations";

// ⚙️ Initialise Stripe avec ta clé publique
const stripePromise = loadStripe("pk_test_51SPObp2X7Uew5IUAPOo1Nwnfk9oKLqRTcQEs0xy7SMiHzN8op5I9D6RW7Hc5gimQXWjlaxp32wFVPhoAN3lbwJqO00nCik4Loo");

function PaiementStep({ nextStep, prevStep, contractData, selectedFreelance }) {
  const [methodePaiement, setMethodePaiement] = useState("");
  const isCarteSelected = methodePaiement === "carte";

  // --- Validation bouton "Valider et payer"
  const handleValider = () => {
    if (!methodePaiement) return;

    if (methodePaiement === "carte") {
      // Déclenche le submit du formulaire Stripe
      document.getElementById("stripe-submit")?.click();
    } else {
      nextStep();
    }
  };

  const fees = calculateContractFees(contractData || {});

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "À définir";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif et paiement</h2>
      <p className="text-gray-600 mb-8">Vérifiez les détails avant de finaliser votre contrat</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Résumé contrat */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé du contrat</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Mission :</strong> {contractData?.title || "Non défini"}</li>
            <li><strong>Indépendant :</strong> {selectedFreelance ? `${selectedFreelance.prenom} ${selectedFreelance.nom}` : "Non sélectionné"}</li>
            <li><strong>Type de prestation :</strong> {contractData?.skills || "Non défini"}</li>
            <li><strong>Durée :</strong> {fees.durationDisplay}</li>
            <li><strong>Tarif :</strong> {fees.budgetDisplay}</li>
            <li><strong>Date de début :</strong> {formatDate(contractData?.startDate)}</li>
            <li><strong>Adresse :</strong> {contractData?.location || "Non définie"}</li>
          </ul>

          <h4 className="text-md font-semibold text-gray-800 mt-6 mb-3">Détail des coûts</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Tarif freelance ({fees.durationDisplay} × {fees.budgetDisplay.split("/")[0]}) : <strong>{formatEuro(fees.baseAmount)}</strong></li>
            <li>Commission Marchés BTP ({formatPercent(fees.commissionRate)}) : {formatEuro(fees.commission)}</li>
            <li>Sous-total HT : {formatEuro(fees.subtotalHT)}</li>
            <li>TVA ({formatPercent(fees.tvaRate)}) : {formatEuro(fees.tva)}</li>
            <li className="text-blue-600 font-semibold pt-2 border-t">Total TTC : {formatEuro(fees.totalTTC)}</li>
          </ul>
        </div>

        {/* Paiement */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de paiement</h3>
          <div className="space-y-4">
            <label className={`block p-4 border rounded-lg cursor-pointer ${methodePaiement === "carte" ? "border-primary bg-blue-50" : "border-gray-300"}`}>
              <input
                type="radio"
                name="paiement"
                value="carte"
                checked={methodePaiement === "carte"}
                onChange={(e) => setMethodePaiement(e.target.value)}
                className="mr-3"
              />
              <span className="font-medium">Carte bancaire</span>
              <p className="text-sm text-gray-500 ml-6">Paiement sécurisé en ligne</p>
            </label>

            <label className={`block p-4 border rounded-lg cursor-pointer ${methodePaiement === "especes" ? "border-primary bg-blue-50" : "border-gray-300"}`}>
              <input
                type="radio"
                name="paiement"
                value="especes"
                checked={methodePaiement === "especes"}
                onChange={(e) => setMethodePaiement(e.target.value)}
                className="mr-3"
              />
              <span className="font-medium">Paiement en espèces</span>
              <p className="text-sm text-gray-500 ml-6">Payer directement avec le freelance</p>
            </label>
          </div>

          {/* Stripe Elements */}
          {isCarteSelected && (
            <div className="mt-6">
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm nextStep={nextStep} totalAmount={fees.totalTTC} />
              </Elements>
            </div>
          )}
        </div>
      </div>

      {/* Boutons navigation */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded hover:bg-gray-200"
        >
          ← Retour
        </button>
        <button
          onClick={handleValider}
          disabled={!methodePaiement}
          className={`px-6 py-2 rounded text-white font-medium ${methodePaiement ? "bg-primary hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Valider et payer
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   ✅ Sous-composant Stripe (formulaire sécurisé)
   ========================================================== */
function StripeCheckoutForm({ nextStep, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3002/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "eur",
          description: "Paiement mission Marchés BTP",
        }),
      });

      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Erreur lors de la création du paiement.");

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        nextStep();
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Informations de paiement :
      </label>

      <div className="p-3 border rounded-lg bg-white shadow-sm">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button id="stripe-submit" type="submit" disabled={!stripe || loading} className="hidden">
        Payer
      </button>
    </form>
  );
}

export default PaiementStep;