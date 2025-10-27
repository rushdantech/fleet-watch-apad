import { VehicleInventory, User } from "@/types/inventory";

export const mockUsers: User[] = [
  {
    id: "U001",
    name: "Admin User",
    role: "administrator",
  },
  {
    id: "U002",
    name: "Viewer User",
    role: "viewer",
  },
];

export const mockVehicles: VehicleInventory[] = [
  {
    id: "V001",
    plateNumber: "ABC 1234",
    vehicleType: "Bus",
    model: "Scania",
    make: "K360IB",
    year: 2022,
    chassisNumber: "SCN12345678901234",
    engineNumber: "ENG12345678",
    driver: "Ahmad bin Abdullah",
    department: "Operations",
    branch: "Kuala Lumpur",
    insurance: {
      provider: "Etiqa Takaful",
      policyNumber: "ETQ123456789",
      startDate: "2024-01-01",
      expiryDate: "2024-12-31",
    },
    roadTax: {
      startDate: "2024-01-01",
      expiryDate: "2024-12-31",
    },
    status: "active",
    createdBy: "U001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "V002",
    plateNumber: "DEF 5678",
    vehicleType: "Truck",
    model: "Hino",
    make: "500 Series",
    year: 2023,
    chassisNumber: "HIN98765432109876",
    engineNumber: "ENG98765432",
    department: "Logistics",
    branch: "Penang",
    insurance: {
      provider: "Takaful Malaysia",
      policyNumber: "TM987654321",
      startDate: "2024-02-01",
      expiryDate: "2024-05-01", // Expiring soon
    },
    roadTax: {
      startDate: "2024-02-01",
      expiryDate: "2024-05-15", // Expiring soon
    },
    status: "active",
    createdBy: "U001",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "V003",
    plateNumber: "GHI 9012",
    vehicleType: "Van",
    model: "Toyota",
    make: "HiAce",
    year: 2021,
    chassisNumber: "TYT45678901234567",
    engineNumber: "ENG45678901",
    driver: "Kumar Selvam",
    department: "Delivery",
    branch: "Johor Bahru",
    insurance: {
      provider: "Kurnia Insurance",
      policyNumber: "KI456789012",
      startDate: "2023-01-01",
      expiryDate: "2024-01-01", // Expired
    },
    roadTax: {
      startDate: "2023-01-01",
      expiryDate: "2024-01-15", // Expired
    },
    status: "inactive",
    createdBy: "U001",
    createdAt: "2023-01-01T00:00:00Z",
    modifiedBy: "U001",
    modifiedAt: "2024-01-15T00:00:00Z",
  },
];
