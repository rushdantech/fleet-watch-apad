import type { AuditLog } from "@/types/inventory";

// In a real application, this would be stored in a database
let auditLogs: AuditLog[] = [];

export const addAuditLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
  const newLog: AuditLog = {
    ...log,
    id: `LOG${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  auditLogs = [newLog, ...auditLogs];
  return newLog;
};

export const getAuditLogs = (vehicleId?: string) => {
  return vehicleId
    ? auditLogs.filter((log) => log.vehicleId === vehicleId)
    : auditLogs;
};

export const clearAuditLogs = () => {
  auditLogs = [];
};
