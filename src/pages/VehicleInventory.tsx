import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { getExpiryStatus, getExpiryStatusColor } from "@/types/inventory";
import type { VehicleInventory } from "@/types/inventory";
import { VehicleFormDialog } from "@/components/VehicleFormDialog";
import { DeleteVehicleDialog } from "@/components/DeleteVehicleDialog";
import { InsuranceRenewalDialog } from "@/components/InsuranceRenewalDialog";
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, renewInsurance } from "@/lib/vehicles";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const VehicleInventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInventory | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [insuranceRenewalOpen, setInsuranceRenewalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleInventory[]>([]);

  const currentUser = getCurrentUser();
  const canCreate = hasPermission("create");
  const canEdit = hasPermission("edit");
  const canDelete = hasPermission("delete");
  const canRenewInsurance = hasPermission("renew_insurance");

  useEffect(() => {
    setVehicles(getVehicles());
  }, []);

  const handleAddVehicle = () => {
    setFormMode("add");
    setSelectedVehicle(undefined);
    setFormOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleInventory) => {
    setFormMode("edit");
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDeleteVehicle = (vehicle: VehicleInventory) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      deleteVehicle(selectedVehicle.id, currentUser?.id || "");
      setVehicles(getVehicles());
      setDeleteDialogOpen(false);
      setSelectedVehicle(undefined);
    }
  };

  const handleSubmit = (data: any) => {
    if (formMode === "add") {
      const newVehicle = addVehicle(data, currentUser?.id || "");
      setVehicles(getVehicles());
    } else if (selectedVehicle) {
      updateVehicle(selectedVehicle.id, data, currentUser?.id || "");
      setVehicles(getVehicles());
    }
    setFormOpen(false);
  };

  const handleRenewInsurance = (vehicle: VehicleInventory) => {
    setSelectedVehicle(vehicle);
    setInsuranceRenewalOpen(true);
  };

  const handleInsuranceRenewalSubmit = (data: any) => {
    if (selectedVehicle) {
      renewInsurance(selectedVehicle.id, data, currentUser?.id || "");
      setVehicles(getVehicles());
      setInsuranceRenewalOpen(false);
      setSelectedVehicle(undefined);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: VehicleInventory["status"]) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getExpiryBadge = (date: string) => {
    const status = getExpiryStatus(date);
    return (
      <span className={getExpiryStatusColor(status)}>
        {new Date(date).toLocaleDateString()}
        {status !== "valid" && (
          <AlertTriangle className="inline-block ml-1 h-4 w-4" />
        )}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Inventory</h1>
        <p className="text-muted-foreground">
          Manage and monitor your organization's vehicle fleet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>
            A list of all registered vehicles in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 w-full sm:flex-row sm:flex-1 sm:max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "active" | "inactive") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {canCreate && (
                <Button onClick={handleAddVehicle} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              )}
              {canRenewInsurance && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/bulk-insurance-renewal")}
                  className="w-full sm:w-auto"
                >
                  Bulk Insurance Renewal
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Vehicle Info</TableHead>
                  <TableHead>Department / Branch</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Insurance Expiry</TableHead>
                  <TableHead>Road Tax Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.plateNumber}
                    </TableCell>
                    <TableCell>
                      <div>{vehicle.make} {vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.vehicleType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{vehicle.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.branch}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.driver || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div>{getExpiryBadge(vehicle.insurance.expiryDate)}</div>
                        {canRenewInsurance && getExpiryStatus(vehicle.insurance.expiryDate) !== "valid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/insurance-renewal/${vehicle.id}`)}
                            className="w-full"
                          >
                            Renew Insurance
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getExpiryBadge(vehicle.roadTax.expiryDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(vehicle.status)}
                        <div className="flex gap-1">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteVehicle(vehicle)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selectedVehicle}
        onSubmit={handleSubmit}
      />

      <DeleteVehicleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        vehiclePlate={selectedVehicle?.plateNumber || ""} />

      {selectedVehicle && (
        <InsuranceRenewalDialog
          open={insuranceRenewalOpen}
          onOpenChange={setInsuranceRenewalOpen}
          vehicle={selectedVehicle}
          onSubmit={handleInsuranceRenewalSubmit}
        />
      )}
    </div>
  );
};

export default VehicleInventory;
