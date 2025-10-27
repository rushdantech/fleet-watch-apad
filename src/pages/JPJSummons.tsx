import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { mockSummons } from "@/data/mockSummons";
import { mockDrivers } from "@/data/mockDrivers";
import type { Summons } from "@/types/summons";
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

export default function JPJSummons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "blacklisted" | "regular">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "overdue" | "paid">("all");

  // Get driver name by ID
  const filteredSummons = mockSummons.filter((summons) => {
    const matchesSearch = 
      summons.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summons.vehiclePlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summons.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "blacklisted" && summons.isBlacklisted) ||
      (statusFilter === "regular" && !summons.isBlacklisted);

    const matchesPayment = 
      paymentFilter === "all" ||
      paymentFilter === summons.status;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalAmount = filteredSummons.reduce((sum, summons) => sum + summons.amount, 0);
  const pendingCount = filteredSummons.filter(s => s.status === "pending").length;
  const overdueCount = filteredSummons.filter(s => s.status === "overdue").length;
  const blacklistedCount = filteredSummons.filter(s => s.isBlacklisted).length;

  const getStatusBadge = (summons: Summons) => {
    if (summons.status === "overdue") {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    if (summons.status === "pending") {
      return <Badge variant="outline">Pending</Badge>;
    }
    return <Badge variant="default">Paid</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">JPJ Summons</h1>
        <p className="text-muted-foreground">
          Manage and monitor all JPJ summons across your fleet
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For {filteredSummons.length} summons
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blacklisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{blacklistedCount}</div>
            <p className="text-xs text-muted-foreground">
              Serious offenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Summons</CardTitle>
          <CardDescription>
            List of all JPJ summons issued to your vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 w-full sm:flex-row sm:flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search summons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "blacklisted" | "regular") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentFilter}
                onValueChange={(value: "all" | "pending" | "overdue" | "paid") => setPaymentFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              Export List
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Speed (km/h)</TableHead>
                  <TableHead className="text-right">Amount (RM)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummons.map((summons) => (
                  <TableRow key={summons.id}>
                    <TableCell className="font-medium">
                      {summons.referenceNumber}
                      {summons.isBlacklisted && (
                        <Badge variant="destructive" className="ml-2">Blacklisted</Badge>
                      )}
                    </TableCell>
                    <TableCell>{summons.vehiclePlateNumber}</TableCell>
                    <TableCell>
                      {new Date(summons.offenseDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {summons.location}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Limit: {summons.speedLimit}</div>
                      <div className={summons.isBlacklisted ? "text-red-500 font-bold" : "font-medium"}>
                        Actual: {summons.actualSpeed}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {summons.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(summons)}</TableCell>
                    <TableCell>
                      {summons.status !== "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          Pay Now
                        </Button>
                      )}
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
}
