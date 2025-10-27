import { useCallback, useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import type { Vehicle } from "@/types/vehicle";

interface VehicleMapProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "calc(100vh - 180px)", // Adjust based on your header height
};

// Center on Kuala Lumpur by default
const defaultCenter = {
  lat: 3.139,
  lng: 101.6869,
};

export const VehicleMap = ({ vehicles, onVehicleSelect }: VehicleMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const getMarkerIcon = useCallback((status: Vehicle["status"]) => {
    const baseUrl = "http://maps.google.com/mapfiles/ms/icons/";
    switch (status) {
      case "moving":
        return `${baseUrl}green-dot.png`;
      case "idle":
        return `${baseUrl}yellow-dot.png`;
      case "stopped":
        return `${baseUrl}red-dot.png`;
      case "offline":
        return `${baseUrl}grey-dot.png`;
      default:
        return `${baseUrl}blue-dot.png`;
    }
  }, []);

  const markers = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        position: {
          lat: vehicle.location.lat,
          lng: vehicle.location.lng,
        },
        icon: getMarkerIcon(vehicle.status),
        vehicle,
      })),
    [vehicles, getMarkerIcon]
  );

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={defaultCenter}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {markers.map(({ position, icon, vehicle }) => (
        <MarkerF
          key={vehicle.id}
          position={position}
          icon={icon}
          title={`${vehicle.plateNumber} - ${vehicle.driver}`}
          onClick={() => onVehicleSelect?.(vehicle)}
        />
      ))}
    </GoogleMap>
  );
};
