import { useState } from "react";
import { Bus, AlertTriangle, Activity, Gauge } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { mockVehicles, mockKPIData } from "@/data/mockVehicles";
import { VehicleList } from "@/components/VehicleList";
import { VehicleMap } from "@/components/VehicleMap";
import type { Vehicle } from "@/types/vehicle";

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

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

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Vehicle List - Left Side */}
        <div className="lg:col-span-4">
          <VehicleList
            vehicles={mockVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />
        </div>

        {/* Map - Right Side */}
        <div className="lg:col-span-8">
          <VehicleMap
            vehicles={mockVehicles}
            onVehicleSelect={setSelectedVehicle}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
