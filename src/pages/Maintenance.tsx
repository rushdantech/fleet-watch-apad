import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Search, History, Plus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMaintenance } from "@/data/mockMaintenance";
import { ServiceRecord, ServiceTask } from "@/types/maintenance";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ServiceTaskList } from "@/components/ServiceTaskList";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const serviceFormSchema = z.object({
  mileage: z.number().min(0, "Mileage must be positive"),
  additionalNotes: z.string().optional(),
});

interface ServiceHistoryDialogProps {
  vehicleId: string;
  plateNumber: string;
  serviceHistory: ServiceRecord[];
}

const ServiceHistoryDialog = ({ vehicleId, plateNumber, serviceHistory }: ServiceHistoryDialogProps) => {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      mileage: 0,
      additionalNotes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof serviceFormSchema>) => {
    console.log("New service record:", { vehicleId, ...data });
    setIsAddServiceOpen(false);
    form.reset();
  };

  const handleTaskChange = (taskId: string, completed: boolean) => {
    console.log("Task updated:", taskId, completed);
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    console.log("Notes updated:", taskId, notes);
  };

  const getCompletionStatus = (tasks: ServiceTask[]) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / total) * 100);
    
    return {
      completed,
      total,
      percentage,
      status: percentage === 100 ? "complete" : percentage >= 50 ? "in-progress" : "pending"
    };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Service History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Service History - {plateNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Service Records</h3>
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Add Service Record - {plateNumber}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Mileage (km)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-4">Service Checklist</h4>
                      <ScrollArea className="h-[400px] pr-4">
                        <ServiceTaskList
                          tasks={serviceHistory[0].completedTasks.map(t => ({ ...t, completed: false }))}
                          onTaskChange={handleTaskChange}
                          onNotesChange={handleNotesChange}
                        />
                      </ScrollArea>
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any additional notes..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Service Record</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceHistory.map((record) => {
                  const completion = getCompletionStatus(record.completedTasks);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{format(parseISO(record.serviceDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{record.mileage.toLocaleString()} km</TableCell>
                      <TableCell>
                        <Badge
                          variant={completion.status === "complete" ? "default" : 
                                 completion.status === "in-progress" ? "secondary" : "outline"}
                        >
                          {completion.completed}/{completion.total} tasks ({completion.percentage}%)
                        </Badge>
                      </TableCell>
                      <TableCell>RM {record.cost?.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>{record.createdBy}</div>
                        <div className="text-xs">{format(parseISO(record.createdAt), 'dd MMM yyyy HH:mm')}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {selectedRecord && (
            <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>
                    Service Details - {format(parseISO(selectedRecord.serviceDate), 'dd MMM yyyy')}
                  </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="checklist">
                  <TabsList>
                    <TabsTrigger value="checklist">Service Checklist</TabsTrigger>
                    <TabsTrigger value="details">Service Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="checklist" className="mt-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <ServiceTaskList
                        tasks={selectedRecord.completedTasks}
                        onTaskChange={() => {}}
                        onNotesChange={() => {}}
                      />
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label>Mileage</Label>
                          <div className="text-lg font-medium">
                            {selectedRecord.mileage.toLocaleString()} km
                          </div>
                        </div>
                        <div>
                          <Label>Service Cost</Label>
                          <div className="text-lg font-medium">
                            RM {selectedRecord.cost?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                      {selectedRecord.additionalNotes && (
                        <div>
                          <Label>Additional Notes</Label>
                          <div className="mt-1 text-muted-foreground">
                            {selectedRecord.additionalNotes}
                          </div>
                        </div>
                      )}
                      <div className="pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Recorded by {selectedRecord.createdBy} on{' '}
                          {format(parseISO(selectedRecord.createdAt), 'dd MMM yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Maintenance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = mockMaintenance.filter((vehicle) =>
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Maintenance</h1>
        <p className="text-muted-foreground">Track and manage vehicle maintenance records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by plate number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Last Mileage</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                    <TableCell>{vehicle.lastMileage.toLocaleString()} km</TableCell>
                    <TableCell>{format(parseISO(vehicle.lastServiceDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{format(parseISO(vehicle.nextServiceDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`#/service-history?vehicleId=${vehicle.vehicleId}`)}
          >
            <History className="h-4 w-4 mr-2" />
            Service History
          </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;