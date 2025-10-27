import type { VehicleInventory } from "@/types/inventory";
import { mockInventoryVehicles } from "@/data/mockVehicles";
import { addAuditLog } from "./audit";

// In a real application, this would be stored in a database
let vehicles = [...mockInventoryVehicles];

export const getVehicles = () => vehicles;

export const addVehicle = (
  vehicle: Omit<VehicleInventory, "id" | "status" | "createdAt" | "createdBy">,
  userId: string
) => {
  const newVehicle: VehicleInventory = {
    ...vehicle,
    id: `V${String(vehicles.length + 1).padStart(3, "0")}`,
    status: "active",
    createdAt: new Date().toISOString(),
    createdBy: userId,
  };

  vehicles = [...vehicles, newVehicle];

  addAuditLog({
    vehicleId: newVehicle.id,
    action: "create",
    performedBy: userId,
  });

  return newVehicle;
};

export const updateVehicle = (
  id: string,
  updates: Partial<VehicleInventory>,
  userId: string
) => {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const oldVehicle = vehicles[index];
  const changes: Record<string, { old: any; new: any }> = {};

  // Track changes for audit log
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== oldVehicle[key as keyof VehicleInventory]) {
      changes[key] = {
        old: oldVehicle[key as keyof VehicleInventory],
        new: value,
      };
    }
  });

  const updatedVehicle: VehicleInventory = {
    ...oldVehicle,
    ...updates,
    modifiedAt: new Date().toISOString(),
    modifiedBy: userId,
  };

  vehicles = [
    ...vehicles.slice(0, index),
    updatedVehicle,
    ...vehicles.slice(index + 1),
  ];

  addAuditLog({
    vehicleId: id,
    action: "update",
    performedBy: userId,
    changes,
  });

  return updatedVehicle;
};

export const deleteVehicle = (id: string, userId: string) => {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return false;

  const updatedVehicle: VehicleInventory = {
    ...vehicles[index],
    status: "inactive",
    modifiedAt: new Date().toISOString(),
    modifiedBy: userId,
  };

  vehicles = [
    ...vehicles.slice(0, index),
    updatedVehicle,
    ...vehicles.slice(index + 1),
  ];

  addAuditLog({
    vehicleId: id,
    action: "delete",
    performedBy: userId,
  });

  return true;
};

export const renewInsurance = (
  id: string,
  insurance: VehicleInventory["insurance"],
  userId: string
) => {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const oldVehicle = vehicles[index];
  const updatedVehicle: VehicleInventory = {
    ...oldVehicle,
    insurance,
    modifiedAt: new Date().toISOString(),
    modifiedBy: userId,
  };

  vehicles = [
    ...vehicles.slice(0, index),
    updatedVehicle,
    ...vehicles.slice(index + 1),
  ];

  addAuditLog({
    vehicleId: id,
    action: "renew_insurance",
    performedBy: userId,
    changes: {
      insurance: {
        old: oldVehicle.insurance,
        new: insurance,
      },
    },
  });

  return updatedVehicle;
};