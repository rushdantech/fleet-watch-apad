import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { mockVehicles } from "@/data/mockVehicles";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, AlertTriangle } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 2rem)",
};

const getStatusColor = (status: "moving" | "idle" | "stopped" | "offline") => {
  switch (status) {
    case "moving":
      return "#22c55e"; // green-500
    case "idle":
      return "#eab308"; // yellow-500
    case "stopped":
      return "#ef4444"; // red-500
    case "offline":
      return "#6b7280"; // gray-500
    default:
      return "#6b7280";
  }
};

export default function VehicleMapView() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(mockVehicles.find(v => v.id === vehicleId));

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    document.title = `Vehicle ${vehicle?.plateNumber || ""} - Map View`;
  }, [vehicle]);

  if (loadError) {
    return (
      <div className="p-4 text-red-500">
        Error loading Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="p-4">Loading map...</div>;
  }

  if (!vehicle) {
    return <div className="p-4">Vehicle not found.</div>;
  }

  const center = {
    lat: vehicle.location.lat,
    lng: vehicle.location.lng,
  };

  const totalAlerts = 
    vehicle.overspeedCount + 
    vehicle.harshBrakeCount + 
    vehicle.harshAccelCount;

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        <MarkerF
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getStatusColor(vehicle.status),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }}
        >
          <InfoWindowF>
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{vehicle.plateNumber}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.id}</div>
                    </div>
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Driver</span>
                      <span className="font-medium">{vehicle.driver}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Gauge className="h-4 w-4" />
                        Speed
                      </span>
                      <span className={`font-medium ${vehicle.speed > 80 ? 'text-red-500' : ''}`}>
                        {vehicle.speed} km/h
                      </span>
                    </div>

                    {totalAlerts > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Alerts
                        </span>
                        <span className="font-medium text-red-500">
                          {totalAlerts}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <div className="text-muted-foreground text-xs">Location</div>
                      <div className="text-sm">{vehicle.location.address}</div>
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                      Last updated: {new Date(vehicle.lastUpdate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </InfoWindowF>
        </MarkerF>
      </GoogleMap>
    </div>
  );
}
