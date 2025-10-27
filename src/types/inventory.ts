export type VehicleType = "Bus" | "Truck" | "Van" | "Car" | "Other";

export type VehicleStatus = "active" | "inactive";

export type ExpiryStatus = "valid" | "expiring_soon" | "expired";

export interface Insurance {
  provider: string;
  policyNumber: string;
  startDate: string;
  expiryDate: string;
  documentUrl?: string;
}

export interface RoadTax {
  startDate: string;
  expiryDate: string;
  documentUrl?: string;
}

export interface VehicleInventory {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  model: string;
  make: string;
  year: number;
  chassisNumber: string;
  engineNumber: string;
  driver?: string;
  department: string;
  branch: string;
  insurance: Insurance;
  roadTax: RoadTax;
  remarks?: string;
  status: VehicleStatus;
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface AuditLog {
  id: string;
  vehicleId: string;
  action: "create" | "update" | "delete" | "renew_insurance" | "renew_roadtax";
  performedBy: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
}

export interface User {
  id: string;
  name: string;
  role: "administrator" | "viewer";
}

export const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 30) return "expiring_soon";
  return "valid";
};

export const getExpiryStatusColor = (status: ExpiryStatus): string => {
  switch (status) {
    case "valid":
      return "text-green-500";
    case "expiring_soon":
      return "text-yellow-500";
    case "expired":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
