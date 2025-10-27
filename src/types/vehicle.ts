export interface Vehicle {
  id: string;
  plateNumber: string;
  driver: string;
  status: "moving" | "idle" | "stopped" | "offline";
  speed: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  overspeedCount: number;
  harshBrakeCount: number;
  harshAccelCount: number;
  lastUpdate: string;
}

export interface KPIData {
  totalVehicles: number;
  activeVehicles: number;
  totalAlerts: number;
  avgSpeed: number;
}
