import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix Leaflet default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.Default.prototype;
DefaultIcon.imagePath = '';
Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow
});

interface MapPreviewProps {
  url: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ url }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [zoningDistricts, setZoningDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams({
          where: '1=1',
          outFields: '*',
          f: 'geojson',
          returnGeometry: 'true'
        });
        
        const queryUrl = `${url}/0/query?${queryParams}`;
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid GeoJSON data received');
        }

        setGeoJsonData(data);

        // Extract unique zoning districts
        const districts = [...new Set(
          data.features
            .map((f: any) => f.properties?.ZONING_DISTRICT || f.properties?.zoning_district)
            .filter(Boolean)
        )];
        setZoningDistricts(districts);

        // Calculate bounds
        if (data.features.length > 0) {
          let minLat = Infinity;
          let maxLat = -Infinity;
          let minLng = Infinity;
          let maxLng = -Infinity;

          data.features.forEach((feature: any) => {
            if (!feature.geometry || !feature.geometry.coordinates) return;
            
            const coords = feature.geometry.type === 'MultiPolygon'
              ? feature.geometry.coordinates.flat(2)
              : feature.geometry.coordinates.flat(1);
            
            coords.forEach((coord: number[]) => {
              if (Array.isArray(coord) && coord.length === 2) {
                const [lng, lat] = coord;
                if (!isNaN(lat) && !isNaN(lng)) {
                  minLat = Math.min(minLat, lat);
                  maxLat = Math.max(maxLat, lat);
                  minLng = Math.min(minLng, lng);
                  maxLng = Math.max(maxLng, lng);
                }
              }
            });
          });

          if (minLat !== Infinity && maxLat !== -Infinity && minLng !== Infinity && maxLng !== -Infinity) {
            setBounds([[minLat, minLng], [maxLat, maxLng]]);
          } else {
            // Fallback to a default view if bounds calculation fails
            setBounds([[33.5, -84.5], [34.5, -83.5]]); // Default to Georgia area
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load map data');
        setIsLoading(false);
        // Set default bounds on error
        setBounds([[33.5, -84.5], [34.5, -83.5]]);
      }
    };

    fetchGeoJson();
  }, [url]);

  const getColor = (district: string) => {
    let hash = 0;
    for (let i = 0; i < district.length; i++) {
      hash = district.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-error-600">
          <p>Failed to load map data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        bounds={bounds || [[33.5, -84.5], [34.5, -83.5]]}
        className="w-full h-[400px] rounded-lg z-0"
        style={{ background: '#f8f9fa' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={(feature) => {
              const district = feature?.properties?.ZONING_DISTRICT || 
                             feature?.properties?.zoning_district || 
                             'Unknown';
              return {
                fillColor: getColor(district),
                fillOpacity: 0.5,
                color: 'black',
                weight: 1
              };
            }}
          />
        )}
      </MapContainer>
      
      {zoningDistricts.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md z-[1000]">
          <h4 className="text-sm font-semibold mb-1">Zoning Districts</h4>
          <div className="space-y-1">
            {zoningDistricts.map((district) => (
              <div key={district} className="flex items-center text-xs">
                <div 
                  className="w-4 h-4 mr-2 rounded"
                  style={{ backgroundColor: getColor(district) }}
                />
                {district}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPreview;