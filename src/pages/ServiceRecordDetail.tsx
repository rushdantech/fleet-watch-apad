import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ServiceRecord, ServiceTask } from "@/types/maintenance";
import { mockMaintenance } from "@/data/mockMaintenance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ServiceTaskList } from "@/components/ServiceTaskList";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function ServiceRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<(ServiceRecord & { plateNumber: string }) | null>(null);
  const [tasks, setTasks] = useState<ServiceTask[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Find the record in the mock data
    const foundRecord = mockMaintenance.reduce<(ServiceRecord & { plateNumber: string }) | null>(
      (found, vehicle) => {
        const record = vehicle.serviceHistory.find(r => r.id === id);
        return record ? { ...record, plateNumber: vehicle.plateNumber } : found;
      },
      null
    );

    if (foundRecord) {
      setRecord(foundRecord);
      setTasks(foundRecord.completedTasks);
    }
  }, [id]);

  const handleTaskChange = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
    setHasChanges(true);
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, notes } : task
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Saving tasks:", tasks);
    toast.success("Service record updated successfully");
    setHasChanges(false);
  };

  if (!record) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-500">Record not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested service record could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/service-history")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service History
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Record Details</h1>
          <p className="text-muted-foreground">
            Service performed on {format(parseISO(record.serviceDate), 'dd MMM yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/service-history")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Plate Number</Label>
              <div className="text-lg font-medium">{record.plateNumber}</div>
            </div>
            <div>
              <Label>Mileage</Label>
              <div className="text-lg font-medium">{record.mileage.toLocaleString()} km</div>
            </div>
            <div>
              <Label>Service Cost</Label>
              <div className="text-lg font-medium">RM {record.cost?.toLocaleString() || 'N/A'}</div>
            </div>
            {record.additionalNotes && (
              <div>
                <Label>Additional Notes</Label>
                <div className="mt-1 text-muted-foreground whitespace-pre-line">
                  {record.additionalNotes}
                </div>
              </div>
            )}
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Recorded by {record.createdBy} on{' '}
                {format(parseISO(record.createdAt), 'dd MMM yyyy HH:mm')}
              </div>
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
