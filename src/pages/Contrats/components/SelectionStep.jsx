// src/pages/Contrats/components/SelectionStep.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { RiArrowDownSLine, RiSearchLine, RiStarFill, RiStarLine } from 'react-icons/ri';

// Petite aide: normaliser pour recherche plein‑texte
const normalize = (s = '') => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Débouncer simple pour éviter de spammer l’API pendant la saisie
function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/**
 * Hypothèse d’endpoint côté auth-api (port 3001) :
 *   GET /api/auth/freelancers?search=&specialty=&region=&maxRate=&minRating=&availableOnly=1
 * Retour attendu (exemples):
 *   [{ id, nom, prenom, user_type:'freelance', specialite, skills:[], experience_years, note, daily_rate, avatar_url, region, ville }]
 *
 * Si ton backend renvoie une autre forme, on mappe en douceur plus bas.
 */
async function fetchFreelancersFromAuthApi(filters) {
  const AUTH_BASE =
    (process.env.REACT_APP_AUTH_API || 'http://localhost:3002') + '/api/auth/freelancers';

  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.specialty && filters.specialty !== 'Toutes les spécialités') params.set('specialty', filters.specialty);
  if (filters.region && filters.region !== 'Toutes les régions') params.set('region', filters.region);
  if (filters.maxRate) params.set('maxRate', String(filters.maxRate));
  if (filters.minRating) params.set('minRating', String(filters.minRating));
  if (filters.availableOnly) params.set('availableOnly', '1');

  const res = await fetch(`${AUTH_BASE}?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // on tente toujours de lire le JSON
  let data;
  try { data = await res.json(); } catch { data = []; }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Erreur ${res.status}`;
    throw new Error(msg);
  }

  // Certains back renvoient {freelancers: [...]}
  return Array.isArray(data) ? data : (Array.isArray(data.freelancers) ? data.freelancers : []);
}

// mapping robuste → structure utilisée dans l’UI
function mapRowToCard(row) {
  // essaye d’extraire ce qui est dispo peu importe les clés
  const id = row.id ?? row.user_id ?? row.freelance_id;
  const nom = row.nom || [row.prenom, row.nom].filter(Boolean).join(' ') || row.name || 'Freelance';
  const specialite =
    row.specialite ||
    (Array.isArray(row.skills) && row.skills.length ? row.skills[0] : row.metier) ||
    'Professionnel';
  const experience = row.experience_years != null ? `${row.experience_years} ans` : (row.experience || '—');
  const note = row.note != null ? Number(row.note) : (row.rating != null ? Number(row.rating) : null);
  const tarifNum =
    row.daily_rate != null ? Number(row.daily_rate) :
    row.tarif_journalier != null ? Number(row.tarif_journalier) :
    row.rate != null ? Number(row.rate) : null;
  const tarif = tarifNum != null ? `${tarifNum} €/jour` : (row.tarif || '—');
  const image = row.avatar_url || row.avatar || row.photo_url || 'https://via.placeholder.com/80x80.png?text=Profil';
  const region = row.region || row.ville || row.location || '';

  return { id, nom, specialite, experience, note, tarif, image, region, raw: row };
}

function SelectionStep({ selectedFreelance, setSelectedFreelance, nextStep, prevStep }) {
  // Filtres UI - Valeurs par défaut pour afficher TOUS les freelances
  const [specialty, setSpecialty] = useState('Toutes les spécialités');
  const [region, setRegion] = useState('Toutes les régions');
  const [tarif, setTarif] = useState(1000);         // tarif max élevé pour ne pas filtrer
  const [minRating, setMinRating] = useState(0);    // pas de filtre de note par défaut
  const [availableOnly, setAvailableOnly] = useState(false);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search, 400);

  // Data
  const [loading, setLoading] = useState(false);
  const [freelances, setFreelances] = useState([]);
  const [error, setError] = useState('');

  const specialties = [
    'Toutes les spécialités',
    'Menuiserie',
    'Plomberie',
    'Électricité',
    'Maçonnerie',
    'Peinture',
    'Carrelage',
    'Couverture',
    'Chauffage',
  ];

  const regions = [
    'Toutes les régions',
    'Île-de-France',
    'Auvergne-Rhône-Alpes',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Hauts-de-France',
    'Grand Est',
    "Provence-Alpes-Côte d'Azur",
    'Pays de la Loire',
  ];

  const filters = useMemo(() => ({
    specialty,
    region,
    maxRate: Number(tarif) || undefined,
    minRating: Number(minRating) || undefined,
    availableOnly,
    search: debouncedSearch.trim(),
  }), [specialty, region, tarif, minRating, availableOnly, debouncedSearch]);

  // Chargement initial + à chaque changement de filtre (debounced pour la recherche)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const rows = await fetchFreelancersFromAuthApi(filters);
        const mapped = rows.map(mapRowToCard);
        if (!mounted) return;

        // Filtre côté front en plus, au cas où l’API est basique
        const normalizedSearch = normalize(filters.search);
        const finalList = mapped.filter((f) => {
          // rating min (seulement si minRating > 0)
          if (filters.minRating > 0 && f.note != null && f.note < filters.minRating) return false;
          // max rate si format "123 €/jour"
          if (filters.maxRate && /\d+/.test(f.tarif)) {
            const n = Number((f.tarif.match(/\d+/) || [0])[0]);
            if (n > filters.maxRate) return false;
          }
          // recherche texte
          if (normalizedSearch) {
            const hay = normalize(`${f.nom} ${f.specialite} ${f.region}`);
            if (!hay.includes(normalizedSearch)) return false;
          }
          // spécialité
          if (filters.specialty && filters.specialty !== 'Toutes les spécialités') {
            const hay = normalize(`${f.specialite}`);
            if (!hay.includes(normalize(filters.specialty))) return false;
          }
          // région
          if (filters.region && filters.region !== 'Toutes les régions') {
            const hay = normalize(`${f.region}`);
            if (!hay.includes(normalize(filters.region))) return false;
          }
          return true;
        });

        setFreelances(finalList);
      } catch (e) {
        if (!mounted) return;
        setFreelances([]);
        setError(e?.message || "Impossible de charger les freelances");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [filters]);

  const isSelected = (f) =>
    selectedFreelance && (selectedFreelance.id === f.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sélectionnez un freelance</h2>
      <p className="text-gray-600 mb-6">Choisissez un professionnel pour cette mission</p>

      {/* Filtres de Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de Recherche</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Spécialités */}
            <div className="relative">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              >
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Régions */}
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              >
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Tarif (max) */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Tarif journalier max (€)</label>
              <div className="px-2">
                <input
                  type="range"
                  min={200}
                  max={1000}
                  value={tarif}
                  onChange={(e) => setTarif(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>200€</span>
                  <span>{tarif}€</span>
                  <span>1000€</span>
                </div>
              </div>
            </div>

            {/* Évaluation min + dispo */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Évaluation minimum</label>
              <div className="flex items-center gap-3">
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={() => setMinRating(minRating >= 5 ? 3 : minRating + 1)}
                  title="Cliquez pour ajuster rapidement"
                >
                  {[1,2,3,4,5].map(i => i <= minRating ? (
                    <RiStarFill key={i} className="text-yellow-400" />
                  ) : (
                    <RiStarLine key={i} className="text-gray-300" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{minRating.toFixed(1)}+</span>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <span>Disponibles uniquement</span>
              </label>
            </div>
          </div>

          {/* Recherche + bouton (optionnel) */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher un freelance..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* Bouton dummy (les filtres déclenchent déjà le chargement) */}
            <button
              type="button"
              onClick={() => { /* rien: tout est auto via debouncedSearch */ }}
              className="bg-primary text-white px-6 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center space-x-2"
            >
              <RiSearchLine />
              <span>Rechercher</span>
            </button>
          </div>
        </div>

        {/* Info / Erreur */}
        {loading && (
          <div className="px-6 py-3 text-sm text-gray-500">Chargement des freelances…</div>
        )}
        {error && !loading && (
          <div className="px-6 py-3 text-sm text-red-600">Erreur : {error}</div>
        )}
      </div>

      {/* Liste des freelances */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {!loading && !error && freelances.length === 0 && (
          <div className="text-gray-500 text-sm px-1">Aucun freelance ne correspond à vos critères.</div>
        )}

        {freelances.map((freelance) => (
          <label
            key={freelance.id}
            className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition ${
              isSelected(freelance) ? 'border-primary bg-blue-50' : 'hover:shadow'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected(freelance)}
              onChange={() => setSelectedFreelance(freelance)}  // ✅ on passe l'objet complet (id utilisé plus tard)
              className="form-checkbox h-5 w-5 text-primary"
            />
            <img
              src={freelance.image}
              alt={freelance.nom}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-lg font-semibold text-gray-800 truncate">{freelance.nom}</h4>
              <p className="text-sm text-gray-600 truncate">
                {freelance.specialite} {freelance.region ? `• ${freelance.region}` : ''} {freelance.experience ? `• ${freelance.experience}` : ''}
              </p>
              <p className="text-sm text-yellow-500">
                Note : {freelance.note != null ? freelance.note : '—'} ⭐
              </p>
              <p className="text-sm text-gray-700">Tarif : {freelance.tarif}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded hover:bg-gray-200"
        >
          ← Retour
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={!selectedFreelance?.id}
          className={`px-6 py-2 rounded text-white font-medium ${
            selectedFreelance?.id ? 'bg-primary hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

export default SelectionStep;
