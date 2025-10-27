import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VehicleStatus = "moving" | "idle" | "stopped" | "offline";

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

const statusConfig = {
  moving: {
    label: "Moving",
    className: "bg-status-moving/10 text-status-moving border-status-moving/20",
  },
  idle: {
    label: "Idle",
    className: "bg-status-idle/10 text-status-idle border-status-idle/20",
  },
  stopped: {
    label: "Stopped",
    className: "bg-status-stopped/10 text-status-stopped border-status-stopped/20",
  },
  offline: {
    label: "Offline",
    className: "bg-status-offline/10 text-status-offline border-status-offline/20",
  },
};

export function VehicleStatusBadge({ status, className }: VehicleStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <span className={cn("mr-1.5 h-2 w-2 rounded-full", `bg-status-${status}`)} />
      {config.label}
    </Badge>
  );
}
