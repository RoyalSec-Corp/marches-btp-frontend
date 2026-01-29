import React, { useState, useEffect } from 'react';
import './RechercheGeoConnectee.css';

/**
 * Composant de recherche geographique connectee
 * Permet de rechercher des freelances/entreprises par localisation
 */
const RechercheGeoConnectee = ({
  onSearch,
  onLocationChange,
  placeholder = 'Rechercher une ville...',
  defaultValue = '',
  disabled = false,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Recherche de villes via API gouvernementale
  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,code,codesPostaux,departement,region&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Erreur recherche geo:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (city) => {
    const location = {
      ville: city.nom,
      codePostal: city.codesPostaux?.[0] || '',
      departement: city.departement?.nom || '',
      region: city.region?.nom || '',
    };
    
    setQuery(city.nom);
    setShowSuggestions(false);
    
    if (onLocationChange) {
      onLocationChange(location);
    }
    if (onSearch) {
      onSearch(location);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="recherche-geo-container">
      <div className="recherche-geo-input-wrapper">
        <input
          type="text"
          className="recherche-geo-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          disabled={disabled}
        />
        {loading && <span className="recherche-geo-loader">...</span>}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="recherche-geo-suggestions">
          {suggestions.map((city) => (
            <li
              key={city.code}
              className="recherche-geo-suggestion-item"
              onClick={() => handleSelect(city)}
            >
              <span className="city-name">{city.nom}</span>
              <span className="city-details">
                {city.codesPostaux?.[0]} - {city.departement?.nom}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RechercheGeoConnectee;
