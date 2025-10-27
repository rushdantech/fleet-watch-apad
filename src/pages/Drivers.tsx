import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileText, AlertTriangle, CreditCard, RefreshCw } from "lucide-react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { mockDrivers } from "@/data/mockDrivers";
import type { Driver, DriverStatus } from "@/types/driver";
import type { Summons } from "@/types/summons";
import { mockSummons } from "@/data/mockSummons";
import { SummonsDialog } from "@/components/SummonsDialog";
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

const getStatusColor = (status: DriverStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "inactive":
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    case "on_leave":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "suspended":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "";
  }
};

const getLicenseStatus = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { status: "expired", color: "text-red-500" };
  if (daysUntilExpiry <= 30) return { status: "expiring_soon", color: "text-yellow-500" };
  return { status: "valid", color: "text-green-500" };
};

export default function Drivers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DriverStatus>("all");
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [summonsDialogOpen, setSummonsDialogOpen] = useState(false);
  const [selectedDriverSummons, setSelectedDriverSummons] = useState<Summons[]>([]);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleViewSummons = (driverId: string) => {
    const driverSummons = mockSummons.filter(s => s.driverId === driverId);
    setSelectedDriverSummons(driverSummons);
    setSummonsDialogOpen(true);
  };

  const handlePaySummons = (summons: Summons, paymentMethod: "fpx" | "card") => {
    console.log("Pay summons:", { summons, paymentMethod });
    // TODO: Implement actual payment
  };

  const handleLicenseRenewal = (driverId: string) => {
    navigate(`/drivers/${driverId}/cdl-renewal`);
  };

  const handleViewDocuments = (driver: Driver) => {
    setSelectedDriver(driver);
    setDocumentViewerOpen(true);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.nricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license.number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor your organization's drivers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
          <CardDescription>
            A list of all registered drivers in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 w-full sm:flex-row sm:flex-1 sm:max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | DriverStatus) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => navigate("/drivers/new")} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>License Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Summons</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => {
                  const licenseStatus = getLicenseStatus(driver.license.expiryDate);
                  const driverSummons = mockSummons.filter(s => s.driverId === driver.id);
                  const blacklistedSummons = driverSummons.filter(s => s.isBlacklisted && s.status !== "paid");
                  const nonBlacklistedSummons = driverSummons.filter(s => !s.isBlacklisted && s.status !== "paid");
                  const psvStatus = driver.license.psv 
                    ? getLicenseStatus(driver.license.psv.expiryDate)
                    : null;

                  return (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {driver.nricNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            License: {driver.license.number}
                          </div>
                          <div className={licenseStatus.color}>
                            Expires: {new Date(driver.license.expiryDate).toLocaleDateString()}
                            {licenseStatus.status !== "valid" && (
                              <AlertTriangle className="inline-block ml-1 h-4 w-4" />
                            )}
                          </div>
                          {driver.license.psv && (
                            <div className={psvStatus?.color}>
                              PSV: {driver.license.psv.number}
                              {psvStatus?.status !== "valid" && (
                                <AlertTriangle className="inline-block ml-1 h-4 w-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{driver.phoneNumber}</div>
                          {driver.email && (
                            <div className="text-sm text-muted-foreground">
                              {driver.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {blacklistedSummons.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="whitespace-nowrap">
                                {blacklistedSummons.length} Blacklisted
                              </Badge>
                            </div>
                          )}
                          {nonBlacklistedSummons.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {nonBlacklistedSummons.length} Regular
                              </Badge>
                            </div>
                          )}
                          {blacklistedSummons.length === 0 && nonBlacklistedSummons.length === 0 && (
                            <div className="text-muted-foreground">No pending summons</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLicenseRenewal(driver.id)}
                            className="whitespace-nowrap"
                          >
                            Renew CDL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/driver-summons/${driver.id}`)}
                            className="whitespace-nowrap"
                          >
                            Check Summons
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocuments(driver)}
                            className="whitespace-nowrap"
                          >
                            {driver.documents?.nricFront ? "View Documents" : "Upload Documents"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SummonsDialog
        open={summonsDialogOpen}
        onOpenChange={setSummonsDialogOpen}
        summonsList={selectedDriverSummons}
        onPaySummons={handlePaySummons}
      />

      {selectedDriver && (
        <DocumentViewer
          open={documentViewerOpen}
          onOpenChange={setDocumentViewerOpen}
          driverName={selectedDriver.name}
          documents={{
            license: {
              imageUrl: "/sample-license.jpg", // This should be the path to your sample license image
              number: selectedDriver.license.number,
              class: selectedDriver.license.class,
              validFrom: selectedDriver.license.issueDate,
              validTo: selectedDriver.license.expiryDate,
              isExpired: new Date(selectedDriver.license.expiryDate) < new Date(),
            },
            nricFront: selectedDriver.documents?.nricFront,
            nricBack: selectedDriver.documents?.nricBack,
            medicalCert: selectedDriver.documents?.medicalCertificate ? {
              url: selectedDriver.documents.medicalCertificate.documentUrl,
              expiryDate: selectedDriver.documents.medicalCertificate.expiryDate,
              isExpired: new Date(selectedDriver.documents.medicalCertificate.expiryDate) < new Date(),
            } : undefined,
          }}
        />
      )}
    </div>
  );
}
