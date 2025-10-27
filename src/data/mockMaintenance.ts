import { VehicleMaintenance, SERVICE_CATEGORIES } from "@/types/maintenance";
import { mockVehicles } from "./mockVehicles";
import { addDays, subDays, format } from "date-fns";

const getRandomTasks = () => {
  return SERVICE_CATEGORIES.flatMap(category =>
    category.tasks.map(task => ({
      ...task,
      completed: Math.random() > 0.3,
      notes: Math.random() > 0.7 ? "Needs attention next service" : undefined
    }))
  );
};

export const mockMaintenance: VehicleMaintenance[] = mockVehicles.map(vehicle => ({
  vehicleId: vehicle.id,
  plateNumber: vehicle.plateNumber,
  lastMileage: Math.floor(Math.random() * 50000) + 50000,
  lastServiceDate: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
  nextServiceDate: format(addDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
  serviceHistory: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, index) => ({
    id: `service-${vehicle.id}-${index}`,
    vehicleId: vehicle.id,
    serviceDate: format(subDays(new Date(), (index + 1) * 90), 'yyyy-MM-dd'),
    mileage: Math.floor(Math.random() * 50000) + 50000,
    completedTasks: getRandomTasks(),
    additionalNotes: Math.random() > 0.5 ? "Customer reported unusual noise during braking" : undefined,
    cost: Math.floor(Math.random() * 1000) + 500,
    createdAt: format(subDays(new Date(), (index + 1) * 90), 'yyyy-MM-dd HH:mm:ss'),
    createdBy: "John Doe"
  }))
}));