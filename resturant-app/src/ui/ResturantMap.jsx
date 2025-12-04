// src/ui/ResturantMap.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map navigation when position changes
const MapController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, position]);

  return null;
};

const ResturantMap = ({ selectedBranch }) => {
  // Only show map if a branch with coordinates is selected
  if (
    !selectedBranch ||
    !selectedBranch.latitude ||
    !selectedBranch.longitude
  ) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-3">
          <h2 className="text-white justify-center font-bold text-2xl flex items-center gap-2">
            موقعنا{" "}
          </h2>
        </div>
        {/* Empty state */}
        <div className="h-[400px] flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">اختر فرعاً لعرض موقعه على الخريطة</p>
            <p className="text-sm">يرجى اختيار أحد الفروع من القائمة أعلاه</p>
          </div>
        </div>
      </div>
    );
  }

  const position = [
    parseFloat(selectedBranch.latitude),
    parseFloat(selectedBranch.longitude),
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-orange-500 px-6 py-3">
        <h2 className="text-white justify-center font-bold text-2xl flex items-center gap-2">
          موقعنا{" "}
        </h2>
      </div>

      {/* Map */}
      <div className="h-[400px]">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapController position={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-orange-600">
                  {selectedBranch.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBranch.address}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedBranch.city}, {selectedBranch.state}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default ResturantMap;
