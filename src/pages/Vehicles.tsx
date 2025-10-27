import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { mockVehicles } from "@/data/mockVehicles";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";

const Vehicles = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Monitoring</h1>
        <p className="text-muted-foreground">Track and monitor all vehicles in real-time</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle ID, plate, or driver..."
                className="pl-9"
              />
            </div>
            <Button>
              <MapPin className="mr-2 h-4 w-4" />
              View on Map
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gradient-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{vehicle.plateNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.id}</p>
                </div>
                <VehicleStatusBadge status={vehicle.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Driver</p>
                <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Speed</p>
                  <p className={`text-lg font-bold ${vehicle.speed > 80 ? 'text-status-alert' : ''}`}>
                    {vehicle.speed} km/h
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Alerts</p>
                  <p className="text-lg font-bold">
                    {vehicle.overspeedCount + vehicle.harshBrakeCount + vehicle.harshAccelCount}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground truncate">{vehicle.location.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Overspeed</p>
                  <p className="text-sm font-semibold">{vehicle.overspeedCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Hard Brake</p>
                  <p className="text-sm font-semibold">{vehicle.harshBrakeCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Hard Accel</p>
                  <p className="text-sm font-semibold">{vehicle.harshAccelCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
