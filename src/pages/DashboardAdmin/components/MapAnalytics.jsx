import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'; // ✅ Version 2.1.0
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIG ICONES (Reste identique) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  });
};

const icons = {
  freelances: createIcon('#8b5cf6'),
  entreprises: createIcon('#f97316'),
  offres: createIcon('#ef4444'),
};

const MapAnalytics = ({ liveData }) => {
  const data = liveData || { entreprises: [], freelances: [], offres: [] };

  return (
    <div className="h-[500px] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0 mt-6">
      
      {/* Légende */}
      <div className="absolute top-4 left-14 z-[500] bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-md border border-gray-200 flex flex-col gap-2">
        <h3 className="font-bold text-gray-800 text-sm border-b pb-1 mb-1">🌍 Activité</h3>
        <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full bg-purple-500"></span><span className="text-gray-600">{data.freelances.length} Freelances</span></div>
        <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span className="text-gray-600">{data.entreprises.length} Entreprises</span></div>
        <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-gray-600">{data.offres.length} Offres</span></div>
      </div>

      <MapContainer center={[46.603354, 1.888334]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LayersControl position="topright">
          
          <LayersControl.Overlay checked name="👨‍💻 Freelances">
             <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
              {data.freelances.map((p, i) => (
                <Marker key={`free-${p.id || i}`} position={[p.lat, p.lng]} icon={icons.freelances}>
                   <Popup><strong className="text-purple-600">Freelance</strong><br/>{p.title}<br/>{p.ville}</Popup>
                </Marker>
              ))}
             </MarkerClusterGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="🏢 Entreprises">
            <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
              {data.entreprises.map((p, i) => (
                <Marker key={`ent-${p.id || i}`} position={[p.lat, p.lng]} icon={icons.entreprises}>
                   <Popup><strong className="text-orange-600">Entreprise</strong><br/>{p.title}<br/>{p.ville}</Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="🔥 Appels d'Offres">
             <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
              {data.offres.map((p, i) => (
                <Marker key={`off-${p.id || i}`} position={[p.lat, p.lng]} icon={icons.offres}>
                  <Popup><strong className="text-red-600">Offre</strong><br/>{p.title}<br/>{p.ville}</Popup>
                </Marker>
              ))}
             </MarkerClusterGroup>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapAnalytics;