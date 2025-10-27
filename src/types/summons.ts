export interface Summons {
  id: string;
  referenceNumber: string;
  vehiclePlateNumber: string;
  offenseDateTime: string;
  location: string;
  offense: string;
  speedLimit?: number;  // in km/h
  actualSpeed?: number; // in km/h
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  isBlacklisted: boolean;
  paymentDate?: string;
  paymentReference?: string;
}

export interface SummonsPayment {
  summons: Summons;
  paymentMethod: "fpx" | "card";
  paymentReference: string;
  paymentDate: string;
  amount: number;
  status: "success" | "pending" | "failed";
}