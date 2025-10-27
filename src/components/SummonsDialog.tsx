import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Summons } from "@/types/summons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SummonsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summonsList: Summons[];
  onPaySummons: (summons: Summons, paymentMethod: "fpx" | "card") => void;
}

export function SummonsDialog({
  open,
  onOpenChange,
  summonsList,
  onPaySummons,
}: SummonsDialogProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"fpx" | "card">("fpx");

  const getStatusBadge = (status: Summons["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "overdue":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      case "paid":
        return <Badge variant="default">Paid</Badge>;
    }
  };

  const totalAmount = summonsList.reduce((sum, summons) => sum + summons.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>JPJ Summons</DialogTitle>
          <DialogDescription>
            List of pending and overdue summons
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Offense</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Amount (RM)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summonsList.map((summons) => (
                <TableRow key={summons.id}>
                  <TableCell className="font-medium">
                    {summons.referenceNumber}
                  </TableCell>
                  <TableCell>
                    <div>{new Date(summons.issuedDate).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(summons.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{summons.offense}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {summons.location}
                    </div>
                  </TableCell>
                  <TableCell>{summons.vehiclePlateNumber}</TableCell>
                  <TableCell className="text-right font-medium">
                    {summons.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(summons.status)}</TableCell>
                  <TableCell>
                    {summons.status !== "paid" && (
                      <Button
                        size="sm"
                        onClick={() => onPaySummons(summons, selectedPaymentMethod)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total Amount:
                </TableCell>
                <TableCell className="text-right font-bold">
                  {totalAmount.toFixed(2)}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {summonsList.some(s => s.status !== "paid") && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Payment Method:</span>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={(value: "fpx" | "card") => setSelectedPaymentMethod(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fpx">FPX Online Banking</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  summonsList
                    .filter(s => s.status !== "paid")
                    .forEach(s => onPaySummons(s, selectedPaymentMethod));
                }}
              >
                Pay All ({summonsList.filter(s => s.status !== "paid").length})
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
