import { Bus, AlertTriangle, Activity, Gauge } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { mockVehicles, mockKPIData } from "@/data/mockVehicles";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your vehicle fleet</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Vehicles"
          value={mockKPIData.totalVehicles}
          icon={Bus}
        />
        <KPICard
          title="Active Vehicles"
          value={mockKPIData.activeVehicles}
          icon={Activity}
          trend={{ value: "+3 from yesterday", isPositive: true }}
        />
        <KPICard
          title="Total Alerts"
          value={mockKPIData.totalAlerts}
          icon={AlertTriangle}
          trend={{ value: "+2 from yesterday", isPositive: false }}
        />
        <KPICard
          title="Avg Speed"
          value={`${mockKPIData.avgSpeed} km/h`}
          icon={Gauge}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Vehicle Status</CardTitle>
            <Button variant="outline" size="sm">View Map</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Plate</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{vehicle.plateNumber}</TableCell>
                    <TableCell>{vehicle.driver}</TableCell>
                    <TableCell>
                      <VehicleStatusBadge status={vehicle.status} />
                    </TableCell>
                    <TableCell>
                      <span className={vehicle.speed > 80 ? "text-status-alert font-semibold" : ""}>
                        {vehicle.speed} km/h
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {vehicle.location.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={vehicle.overspeedCount > 0 ? "text-status-alert font-semibold" : ""}>
                        {vehicle.overspeedCount + vehicle.harshBrakeCount + vehicle.harshAccelCount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
