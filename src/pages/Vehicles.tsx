import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfToday } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ExternalLink } from "lucide-react";
import { mockVehicles } from "@/data/mockVehicles";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";
import { DateTimeRangePicker } from "@/components/DateTimeRangePicker";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfToday(),
    to: startOfToday(),
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

    const handleViewOnMap = (vehicle: typeof mockVehicles[0]) => {
      window.open(`/vehicle-map/${vehicle.id}`, '_blank');
    };

  const filteredVehicles = mockVehicles.filter((vehicle) =>
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Monitoring</h1>
          <p className="text-sm text-muted-foreground">Track and monitor all vehicles in real-time</p>
        </div>
      </div>

      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-4 space-y-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle ID, plate, or driver..."
                className="pl-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <DateTimeRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              className="min-w-[300px]"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gradient-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-medium">{vehicle.plateNumber}</div>
                  <div className="text-xs text-muted-foreground">{vehicle.id}</div>
                </div>
                <div className="flex items-start gap-2">
                  <VehicleStatusBadge status={vehicle.status} />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium truncate ml-2 text-right">{vehicle.driver}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Speed</div>
                    <div className={`font-bold ${vehicle.speed > 80 ? 'text-status-alert' : ''}`}>
                      {vehicle.speed} km/h
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Alerts</div>
                    <div className="font-bold">
                      {vehicle.overspeedCount + vehicle.harshBrakeCount + vehicle.harshAccelCount}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="truncate">{vehicle.location.address}</div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center text-xs">
                  <div>
                    <div className="text-muted-foreground">Overspeed</div>
                    <div className="font-semibold">{vehicle.overspeedCount}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Hard Brake</div>
                    <div className="font-semibold">{vehicle.harshBrakeCount}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Hard Accel</div>
                    <div className="font-semibold">{vehicle.harshAccelCount}</div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                  onClick={() => handleViewOnMap(vehicle)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View in Map
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;