import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "@/lib/vehicles";
import { getExpiryStatus } from "@/types/inventory";
import type { VehicleInventory } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CreditCard } from "lucide-react";

interface VehicleSelection {
  vehicle: VehicleInventory;
  selected: boolean;
  renewalType: "insurance" | "roadtax" | "both";
  daysToInsuranceExpiry: number;
  daysToRoadTaxExpiry: number;
  status: "Expired" | "Urgent" | "Due Soon" | "Up to Date";
}

export default function BulkInsuranceRenewal() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleSelection[]>([]);
  const [filterDays, setFilterDays] = useState<"30" | "60" | "90" | "all">("30");
  const [selectAll, setSelectAll] = useState(false);

  const getDaysToExpiry = (date: string) => {
    const expiryDate = new Date(date);
    const today = new Date();
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRenewalStatus = (insuranceDays: number, roadTaxDays: number) => {
    if (insuranceDays <= 0 || roadTaxDays <= 0) {
      return "Expired";
    }
    if (insuranceDays <= 30 || roadTaxDays <= 30) {
      return "Urgent";
    }
    if (insuranceDays <= 90 || roadTaxDays <= 90) {
      return "Due Soon";
    }
    return "Up to Date";
  };

  useEffect(() => {
    const allVehicles = getVehicles();
    const processedVehicles = allVehicles.map(vehicle => {
      const insuranceDays = getDaysToExpiry(vehicle.insurance.expiryDate);
      const roadTaxDays = getDaysToExpiry(vehicle.roadTax.expiryDate);
      const insuranceStatus = getExpiryStatus(vehicle.insurance.expiryDate);
      const roadTaxStatus = getExpiryStatus(vehicle.roadTax.expiryDate);
      
      return {
        vehicle,
        selected: false,
        renewalType: insuranceStatus !== "valid" && roadTaxStatus !== "valid" ? "both" :
                    insuranceStatus !== "valid" ? "insurance" : "roadtax",
        daysToInsuranceExpiry: insuranceDays,
        daysToRoadTaxExpiry: roadTaxDays,
        status: getRenewalStatus(insuranceDays, roadTaxDays)
      };
    }).filter(v => {
      if (filterDays === "all") return true;
      const dayLimit = parseInt(filterDays);
      return v.daysToInsuranceExpiry <= dayLimit || v.daysToRoadTaxExpiry <= dayLimit;
    });

    setVehicles(processedVehicles);
  }, [filterDays]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setVehicles(vehicles.map(v => ({ ...v, selected: checked })));
  };

  const handleSelectVehicle = (index: number, checked: boolean) => {
    const newVehicles = [...vehicles];
    newVehicles[index].selected = checked;
    setVehicles(newVehicles);
    setSelectAll(newVehicles.every(v => v.selected));
  };

  const handleRenewalTypeChange = (index: number, type: "insurance" | "roadtax" | "both") => {
    const newVehicles = [...vehicles];
    newVehicles[index].renewalType = type;
    setVehicles(newVehicles);
  };

  const getExpiryClass = (date: string) => {
    const status = getExpiryStatus(date);
    switch (status) {
      case "expired":
        return "text-red-500";
      case "expiring_soon":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  const calculateTotal = () => {
    // This would normally come from your pricing logic
    const insuranceCost = 1000;
    const roadTaxCost = 500;

    return vehicles.reduce((total, v) => {
      if (!v.selected) return total;
      switch (v.renewalType) {
        case "both":
          return total + insuranceCost + roadTaxCost;
        case "insurance":
          return total + insuranceCost;
        case "roadtax":
          return total + roadTaxCost;
        default:
          return total;
      }
    }, 0);
  };

  const selectedCount = vehicles.filter(v => v.selected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Insurance & Road Tax Renewal</h1>
        <p className="text-muted-foreground">
          Renew multiple vehicles at once
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Vehicles Requiring Renewal</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label className="sm:whitespace-nowrap">Show vehicles expiring within:</Label>
              <Select
                value={filterDays}
                onValueChange={(value: "30" | "60" | "90" | "all") => setFilterDays(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="all">Show all</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Insurance Expiry</TableHead>
                  <TableHead>Road Tax Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renewal Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((item, index) => (
                  <TableRow key={item.vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={(checked) => handleSelectVehicle(index, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.vehicle.plateNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.vehicle.make} {item.vehicle.model}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={getExpiryClass(item.vehicle.insurance.expiryDate)}>
                        <div>{new Date(item.vehicle.insurance.expiryDate).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.daysToInsuranceExpiry} days remaining
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={getExpiryClass(item.vehicle.roadTax.expiryDate)}>
                        <div>{new Date(item.vehicle.roadTax.expiryDate).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.daysToRoadTaxExpiry} days remaining
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={
                        item.status === "Expired" ? "text-red-500 font-medium" :
                        item.status === "Urgent" ? "text-yellow-500 font-medium" :
                        item.status === "Due Soon" ? "text-blue-500 font-medium" :
                        "text-green-500 font-medium"
                      }>
                        {item.status}
                        {(item.status === "Expired" || item.status === "Urgent") && (
                          <AlertTriangle className="inline-block ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.renewalType}
                        onValueChange={(value: "insurance" | "roadtax" | "both") => 
                          handleRenewalTypeChange(index, value)
                        }
                        disabled={!item.selected}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="insurance">Insurance Only</SelectItem>
                          <SelectItem value="roadtax">Road Tax Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Selected Vehicles:</span>
                <span>{selectedCount}</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>Total Amount:</span>
                <span>RM {calculateTotal().toLocaleString()}</span>
              </div>
              <Button className="w-full" size="lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
