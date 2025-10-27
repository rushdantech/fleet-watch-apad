import { Vehicle } from "@/types/vehicle";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export const VehicleList = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}: VehicleListProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Vehicle List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 p-4">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className={`cursor-pointer transition-colors hover:bg-muted ${
                  selectedVehicle?.id === vehicle.id ? "border-primary" : ""
                }`}
                onClick={() => onVehicleSelect?.(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{vehicle.plateNumber}</h3>
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed:</span>
                      <span className={vehicle.speed > 80 ? "text-status-alert font-semibold" : ""}>
                        {vehicle.speed} km/h
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-right max-w-[200px] truncate">
                        {vehicle.location.address}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alerts:</span>
                      <span className={
                        vehicle.overspeedCount + vehicle.harshBrakeCount + vehicle.harshAccelCount > 0
                          ? "text-status-alert font-semibold"
                          : ""
                      }>
                        {vehicle.overspeedCount + vehicle.harshBrakeCount + vehicle.harshAccelCount}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span>
                        {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
