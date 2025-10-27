import { mockUsers } from "@/data/mockInventory";
import type { User } from "@/types/inventory";

// In a real app, this would be handled by a proper auth system
let currentUser: User | null = mockUsers[0]; // Default to admin user for demo

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const hasPermission = (permission: "create" | "edit" | "delete" | "renew_insurance") => {
  if (!currentUser) return false;
  
  switch (permission) {
    case "create":
    case "edit":
    case "delete":
    case "renew_insurance":
      return currentUser.role === "administrator";
    default:
      return false;
  }
};
