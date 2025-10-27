import { Summons } from "@/types/summons";

// Helper function to generate dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Helper function to generate datetime for the same day
const getDateTime = (hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const mockSummons: Summons[] = [
  {
    id: "S001",
    referenceNumber: "JPJ-2024-001234",
    vehiclePlateNumber: "WXY 1234",
    offenseDateTime: getDateTime(14, 30), // 2:30 PM
    location: "KM235.6 PLUS Highway (N) Seremban - KL",
    offense: "Speeding",
    speedLimit: 90,
    actualSpeed: 128,
    amount: 300,
    dueDate: getDate(15),
    status: "pending",
    isBlacklisted: true,
  },
  {
    id: "S002",
    referenceNumber: "JPJ-2024-001235",
    vehiclePlateNumber: "ABC 5678",
    offenseDateTime: getDateTime(10, 15), // 10:15 AM
    location: "KM12.8 PLUS Highway (S) KL - Seremban",
    offense: "Speeding",
    speedLimit: 90,
    actualSpeed: 115,
    amount: 150,
    dueDate: getDate(-5),
    status: "overdue",
    isBlacklisted: false,
  },
  {
    id: "S003",
    referenceNumber: "JPJ-2024-001236",
    vehiclePlateNumber: "DEF 9012",
    offenseDateTime: getDateTime(8, 45), // 8:45 AM
    location: "KM56.2 PLUS Highway (N) Melaka - Seremban",
    offense: "Speeding",
    speedLimit: 110,
    actualSpeed: 145,
    amount: 500,
    dueDate: getDate(30),
    status: "pending",
    isBlacklisted: true,
  },
  {
    id: "S004",
    referenceNumber: "JPJ-2024-001237",
    vehiclePlateNumber: "GHI 3456",
    offenseDateTime: getDateTime(16, 20), // 4:20 PM
    location: "KM89.4 PLUS Highway (S) Ipoh - KL",
    offense: "Speeding",
    speedLimit: 90,
    actualSpeed: 132,
    amount: 400,
    dueDate: getDate(45),
    status: "pending",
    isBlacklisted: false,
  },
  {
    id: "S005",
    referenceNumber: "JPJ-2024-001238",
    vehiclePlateNumber: "JKL 7890",
    offenseDateTime: getDateTime(12, 10), // 12:10 PM
    location: "KM167.3 PLUS Highway (N) KL - Ipoh",
    offense: "Speeding",
    speedLimit: 110,
    actualSpeed: 156,
    amount: 1000,
    dueDate: getDate(-30),
    status: "overdue",
    isBlacklisted: true,
  },
  {
    id: "S006",
    referenceNumber: "JPJ-2024-001239",
    vehiclePlateNumber: "MNO 1234",
    offenseDateTime: getDateTime(7, 30), // 7:30 AM
    location: "KM324.1 PLUS Highway (S) Penang - Ipoh",
    offense: "Speeding",
    speedLimit: 90,
    actualSpeed: 124,
    amount: 300,
    dueDate: getDate(-60),
    status: "overdue",
    isBlacklisted: true,
  }
];