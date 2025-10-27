import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceTaskList } from "@/components/ServiceTaskList";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { mockMaintenance } from "@/data/mockMaintenance";
import { SERVICE_CATEGORIES } from "@/types/maintenance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewServiceRecord() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState(
    SERVICE_CATEGORIES.flatMap(category =>
      category.tasks.map(task => ({
        ...task,
        completed: false,
        notes: undefined
      }))
    )
  );

  const handleTaskChange = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, notes } : task
      )
    );
  };

  const handleSave = () => {
    if (!selectedVehicle || !mileage) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would be an API call
    console.log("New service record:", {
      vehicleId: selectedVehicle,
      mileage: parseInt(mileage),
      cost: cost ? parseFloat(cost) : undefined,
      notes,
      tasks
    });

    toast.success("Service record created successfully");
    navigate("/service-history");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Service Record</h1>
          <p className="text-muted-foreground">Create a new service record</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/service-history")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Record
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select
                value={selectedVehicle}
                onValueChange={setSelectedVehicle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {mockMaintenance.map((vehicle) => (
                    <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.plateNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Current Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Enter current mileage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Service Cost (RM)</Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Enter service cost"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceTaskList
              tasks={tasks}
              onTaskChange={handleTaskChange}
              onNotesChange={handleNotesChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
