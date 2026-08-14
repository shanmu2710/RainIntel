import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issues in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons based on RainIntel status colors
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const icons = {
  'Completed': createIcon('#0f766e'),
  'In review': createIcon('#2563eb'),
  'Processing': createIcon('#f59e0b')
};

function MapController({ locations, mapRefWrapper }) {
  const map = useMap();
  useEffect(() => {
    mapRefWrapper.current = map;
  }, [map, mapRefWrapper]);

  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, []); 

  return null;
}

export default function GisMap({
  locations,
  selectedLocation,
  onLocationSelect,
  children
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Wait for DOM to adjust then invalidateSize for Leaflet resize tracking
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!locations || locations.length === 0) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '550px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
        <span>No assessment locations available.</span>
      </div>
    );
  }

  const handleZoomIn = () => mapRef.current && mapRef.current.zoomIn();
  const handleZoomOut = () => mapRef.current && mapRef.current.zoomOut();
  const handleReset = () => {
    if (mapRef.current && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
        },
        () => {
          alert('Location permission was denied.');
        }
      );
    }
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
         if (containerRef.current) await containerRef.current.requestFullscreen();
      } else {
         await document.exitFullscreen();
      }
    } catch (e) {
      alert("Fullscreen is unavailable in this browser.");
    }
  };

  // Center maps roughly based on first loaded position initially
  const center = [locations[0].latitude, locations[0].longitude];

  return (
    <div ref={containerRef} className="map-canvas-container" style={{ position: 'relative', width: '100%', height: isFullscreen ? '100vh' : '550px', borderRadius: isFullscreen ? '0' : '12px', overflow: 'hidden', border: isFullscreen ? 'none' : '1px solid #e2e8f0', background: '#f1f5f9' }}>
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.latitude, loc.longitude]}
            icon={icons[loc.status] || icons['Processing']}
            eventHandlers={{ 
              click: () => onLocationSelect && onLocationSelect(loc) 
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ fontSize: '13px' }}>Assessment #{loc.id}</strong><br/>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  <b>Building:</b> {loc.buildingName}<br/>
                  <b>District:</b> {loc.districtName}<br/>
                  <b>Status:</b> {loc.statusRaw}<br/>
                  <b>Roof:</b> {Math.round(loc.roofAreaSqFt || 0).toLocaleString()} sq ft<br/>
                  <b>Harvest:</b> {loc.harvestPotentialL ? Math.round(loc.harvestPotentialL).toLocaleString() : 0} L<br/>
                  <b>Recharge:</b> {loc.rechargePotentialL ? Math.round(loc.rechargePotentialL).toLocaleString() : 0} L
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController locations={locations} mapRefWrapper={mapRef} />
      </MapContainer>
      
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000}}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
             // Pass overrides to GisMapControls implicitly shielding complexity from wrapper
             if (child.type.name === 'GisMapControls') {
               return React.cloneElement(child, {
                 onZoomIn: handleZoomIn,
                 onZoomOut: handleZoomOut,
                 onLocate: handleLocate,
                 onCompass: handleReset,
                 onFullscreen: handleFullscreen,
                 isFullscreen: isFullscreen
               });
             }
             return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}
