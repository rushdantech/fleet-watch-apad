import { useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertTriangle, CreditCard } from "lucide-react";
import { mockSummons } from "@/data/mockSummons";
import { mockDrivers } from "@/data/mockDrivers";

export default function DriverSummons() {
  const { driverId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const driver = mockDrivers.find(d => d.id === driverId);
  const driverSummons = mockSummons.filter(s => s.driverId === driverId);

  const filteredSummons = driverSummons.filter(summon => {
    const matchesSearch = 
      summon.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summon.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || summon.status === statusFilter;
    const matchesType = typeFilter === "all" || 
      (typeFilter === "blacklisted" ? summon.isBlacklisted : !summon.isBlacklisted);

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredSummons.reduce((sum, summon) => sum + summon.amount, 0);
  const pendingCount = filteredSummons.filter(s => s.status === "pending").length;
  const overdueCount = filteredSummons.filter(s => s.status === "overdue").length;
  const blacklistedCount = filteredSummons.filter(s => s.isBlacklisted).length;

  const handlePaySummons = (summonId: string) => {
    console.log("Processing payment for summons:", summonId);
    // TODO: Implement payment processing
  };

  if (!driver) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-500">Driver not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested driver could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Driver Summons</h1>
        <p className="text-muted-foreground">
          Manage summons for {driver.name} ({driver.licenseNumber})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blacklisted</CardTitle>
            <AlertTriangle className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blacklistedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summons List</CardTitle>
          <CardDescription>View and manage driver's summons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by vehicle number or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Summons</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted Only</SelectItem>
                  <SelectItem value="regular">Regular Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No summons found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSummons.map((summon) => (
                    <TableRow key={summon.id}>
                      <TableCell className="font-medium">
                        {summon.vehicleNumber}
                        {summon.isBlacklisted && (
                          <Badge variant="destructive" className="ml-2">
                            Blacklisted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(summon.offenseDateTime), "dd MMM yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{summon.location}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{summon.speedLimit} km/h / </span>
                        <span className={summon.actualSpeed > summon.speedLimit ? "text-red-500 font-medium" : ""}>
                          {summon.actualSpeed} km/h
                        </span>
                      </TableCell>
                      <TableCell>RM {summon.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            summon.status === "paid"
                              ? "default"
                              : summon.status === "overdue"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {summon.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {summon.status !== "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaySummons(summon.id)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
