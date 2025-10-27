import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMaintenance } from "@/data/mockMaintenance";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialVehicle = searchParams.get('vehicleId');
  
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle || "all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get all service records with vehicle info
  const allServiceRecords = mockMaintenance.flatMap(vehicle => 
    vehicle.serviceHistory.map(record => ({
      ...record,
      plateNumber: vehicle.plateNumber,
      vehicleId: vehicle.vehicleId
    }))
  ).sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());

  // Filter records based on vehicle selection and search term
  const filteredRecords = allServiceRecords.filter(record => {
    const matchesVehicle = selectedVehicle === "all" || record.vehicleId === selectedVehicle;
    const matchesSearch = record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVehicle && matchesSearch;
  });

  const getCompletionStatus = (tasks: any[]) => {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service History</h1>
        <p className="text-muted-foreground">View and manage service records</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Records</CardTitle>
            <Button onClick={() => navigate("/service-record/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <div className="w-full sm:w-72">
              <Select
                value={selectedVehicle}
                onValueChange={setSelectedVehicle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {mockMaintenance.map((vehicle) => (
                    <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.plateNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  <TableHead>Service Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No service records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => {
                    const completion = getCompletionStatus(record.completedTasks);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{format(parseISO(record.serviceDate), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="font-medium">{record.plateNumber}</TableCell>
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
                            onClick={() => navigate(`/service-record/${record.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}