import { ServiceCategory, ServiceTask, SERVICE_CATEGORIES } from "@/types/maintenance";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Circle,
  Settings2,
  Cog,
  Disc,
  Zap,
  Truck,
  Fuel,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTaskListProps {
  tasks: ServiceTask[];
  onTaskChange: (taskId: string, completed: boolean) => void;
  onNotesChange: (taskId: string, notes: string) => void;
}

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case "circle":
      return Circle;
    case "settings2":  // Updated to match the icon name in maintenance.ts
      return Settings2;
    case "cog":
      return Cog;
    case "disc":
      return Disc;
    case "zap":
      return Zap;
    case "truck":
      return Truck;
    case "fuel":
      return Fuel;
    case "clipboard":
      return ClipboardList;
    default:
      return Circle;
  }
};

export function ServiceTaskList({ tasks, onTaskChange, onNotesChange }: ServiceTaskListProps) {
  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    const category = task.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, ServiceTask[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
        const categoryInfo = SERVICE_CATEGORIES.find(c => c.id === category);
        const Icon = getCategoryIcon(categoryInfo?.icon || "circle");
        
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 font-medium">
              <Icon className="h-5 w-5" />
              <h3>{categoryInfo?.name || category}</h3>
            </div>
            <div className="grid gap-2">
              {categoryTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 rounded-lg border p-3">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) => onTaskChange(task.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={task.id}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.name}
                    </Label>
                    {task.interval && (
                      <p className="text-xs text-muted-foreground">
                        {task.interval.description}
                      </p>
                    )}
                    {task.notes && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-500">
                        Note: {task.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}