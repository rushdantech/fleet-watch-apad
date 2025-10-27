import { ServiceCategory, ServiceTask, SERVICE_CATEGORIES } from "@/types/maintenance";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
    case "settings2":
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

  // Calculate completion status for each category
  const categoryStatus = Object.entries(groupedTasks).reduce((acc, [category, tasks]) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    acc[category] = {
      total,
      completed,
      percentage: Math.round((completed / total) * 100)
    };
    return acc;
  }, {} as Record<string, { total: number; completed: number; percentage: number }>);

  // Get the first category as default tab
  const defaultCategory = Object.keys(groupedTasks)[0];

  return (
    <Tabs defaultValue={defaultCategory} className="w-full">
      <TabsList className="w-full h-auto flex-wrap gap-2 justify-start bg-transparent p-0">
        {Object.entries(groupedTasks).map(([category, tasks]) => {
          const categoryInfo = SERVICE_CATEGORIES.find(c => c.id === category);
          const Icon = getCategoryIcon(categoryInfo?.icon || "circle");
          const status = categoryStatus[category];
          
          return (
            <TabsTrigger
              key={category}
              value={category}
              className="flex items-center gap-2 data-[state=active]:bg-primary/10"
            >
              <Icon className="h-4 w-4" />
              <span>{categoryInfo?.name || category}</span>
              <Badge 
                variant={status.completed === status.total ? "default" : "outline"}
                className="ml-2"
              >
                {status.completed}/{status.total}
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <TabsContent key={category} value={category} className="mt-4">
          <div className="grid gap-2">
            {categoryTasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                  task.completed && "bg-muted/50"
                )}
              >
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
        </TabsContent>
      ))}
    </Tabs>
  );
}