import { Vehicle, KPIData } from "@/types/vehicle";
import { VehicleInventory } from "@/types/inventory";

// Helper function to generate dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Common vehicle data that will be used in both monitoring and inventory
const commonVehicleData = [
  {
    id: "V001",
    plateNumber: "WXY 1234",
    driver: "Ahmad bin Abdullah",
    make: "Scania",
    model: "K360IB",
    year: 2022,
    chassisNumber: "SCN12345678901234",
    engineNumber: "ENG12345678",
    department: "Operations",
    branch: "Kuala Lumpur",
  },
  {
    id: "V002",
    plateNumber: "ABC 5678",
    driver: "Siti Nurhaliza",
    make: "Hino",
    model: "500 Series",
    year: 2023,
    chassisNumber: "HIN98765432109876",
    engineNumber: "ENG98765432",
    department: "Logistics",
    branch: "Penang",
  },
  {
    id: "V003",
    plateNumber: "DEF 9012",
    driver: "Kumar Selvam",
    make: "Toyota",
    model: "HiAce",
    year: 2021,
    chassisNumber: "TYT45678901234567",
    engineNumber: "ENG45678901",
    department: "Delivery",
    branch: "Johor Bahru",
  },
  {
    id: "V004",
    plateNumber: "GHI 3456",
    driver: "Lee Wei Ming",
    make: "Mercedes-Benz",
    model: "Actros",
    year: 2022,
    chassisNumber: "MBZ12345678901234",
    engineNumber: "ENG12345678",
    department: "Logistics",
    branch: "Kuala Lumpur",
  },
  {
    id: "V005",
    plateNumber: "JKL 7890",
    driver: "Fatimah Zahra",
    make: "Volvo",
    model: "FH16",
    year: 2023,
    chassisNumber: "VLV98765432109876",
    engineNumber: "ENG98765432",
    department: "Operations",
    branch: "Penang",
  },
  {
    id: "V006",
    plateNumber: "MNO 1234",
    driver: "Rajesh Kumar",
    make: "Scania",
    model: "P410",
    year: 2021,
    chassisNumber: "SCN45678901234567",
    engineNumber: "ENG45678901",
    department: "Delivery",
    branch: "Johor Bahru",
  },
  {
    id: "V007",
    plateNumber: "PQR 5678",
    driver: "Tan Mei Ling",
    make: "Isuzu",
    model: "FVR",
    year: 2022,
    chassisNumber: "ISZ12345678901234",
    engineNumber: "ENG12345678",
    department: "Operations",
    branch: "Kuala Lumpur",
  },
  {
    id: "V008",
    plateNumber: "STU 9012",
    driver: "Mohammad Hafiz",
    make: "UD Trucks",
    model: "Quester",
    year: 2023,
    chassisNumber: "UDT98765432109876",
    engineNumber: "ENG98765432",
    department: "Logistics",
    branch: "Penang",
  },
  {
    id: "V009",
    plateNumber: "VWX 3456",
    driver: "Lim Chee Meng",
    make: "Mitsubishi",
    model: "Fuso",
    year: 2021,
    chassisNumber: "MIT45678901234567",
    engineNumber: "ENG45678901",
    department: "Delivery",
    branch: "Johor Bahru",
  },
  {
    id: "V010",
    plateNumber: "YZA 7890",
    driver: "Aisha Abdullah",
    make: "Hino",
    model: "700 Series",
    year: 2022,
    chassisNumber: "HIN12345678901234",
    engineNumber: "ENG12345678",
    department: "Operations",
    branch: "Kuala Lumpur",
  }
];

// Export monitoring data
export const mockVehicles: Vehicle[] = commonVehicleData.map((vehicle, index) => ({
  ...vehicle,
  status: ["moving", "idle", "stopped", "offline"][index % 4] as Vehicle["status"],
  speed: index % 4 === 0 ? 65 : index % 4 === 1 ? 0 : index % 4 === 2 ? 82 : 0,
  location: {
    lat: 3.139 + (index * 0.01),
    lng: 101.6869 + (index * 0.01),
    address: [
      "Jalan Ampang, Kuala Lumpur",
      "Plaza Tol Sungai Besi, Kuala Lumpur",
      "KLIA Expressway, Selangor",
      "Terminal Bersepadu Selatan, Kuala Lumpur",
      "Jalan Tun Razak, Kuala Lumpur",
      "Gombak Bus Depot",
      "Port Klang Container Terminal",
      "Shah Alam Industrial Area",
      "Putrajaya Central",
      "Cyberjaya Tech Park"
    ][index],
  },
  overspeedCount: index % 3 === 0 ? 2 : index % 3 === 1 ? 0 : 5,
  harshBrakeCount: index % 3 === 0 ? 1 : index % 3 === 1 ? 0 : 3,
  harshAccelCount: index % 3 === 0 ? 0 : index % 3 === 1 ? 0 : 2,
  lastUpdate: index % 4 === 3 ? getDate(-1) : new Date().toISOString(),
}));

// Export inventory data
export const mockInventoryVehicles: VehicleInventory[] = commonVehicleData.map((vehicle, index) => ({
  ...vehicle,
  status: "active",
  insurance: {
    provider: [
      "Etiqa Takaful",
      "Takaful Malaysia",
      "Kurnia Insurance",
      "Allianz Malaysia",
      "AXA Affin"
    ][index % 5],
    policyNumber: `POL${String(index + 1).padStart(6, '0')}`,
    startDate: getDate(-180),
    expiryDate: getDate([120, 45, -15, 15, 75, 30, 60, 90, -30, 180][index]), // Mix of valid, expiring soon, and expired
  },
  roadTax: {
    startDate: getDate(-180),
    expiryDate: getDate([90, 30, -30, 45, 60, 15, 75, -15, 120, 150][index]), // Different mix of expiry dates
  },
  remarks: index % 3 === 0 ? "Regular maintenance required" : undefined,
  createdBy: "U001",
  createdAt: getDate(-180),
  modifiedBy: index % 2 === 0 ? "U001" : undefined,
  modifiedAt: index % 2 === 0 ? getDate(-30) : undefined,
}));

export const mockKPIData: KPIData = {
  totalVehicles: mockVehicles.length,
  activeVehicles: mockVehicles.filter(v => v.status !== "offline").length,
  totalAlerts: mockVehicles.reduce((sum, v) => 
    sum + v.overspeedCount + v.harshBrakeCount + v.harshAccelCount, 0),
  avgSpeed: Math.round(
    mockVehicles.reduce((sum, v) => sum + v.speed, 0) / mockVehicles.length
  ),
};