import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockSummons } from "@/data/mockSummons";
import { mockDrivers } from "@/data/mockDrivers";
import { AlertCircle, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SummonsPayment() {
  const { summonsId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Find summons from mock data
  const summons = mockSummons.find((s) => s.id === summonsId);
  
  // Find driver details
  const driver = summons ? mockDrivers.find((d) => d.id === summons.driverId) : null;

  if (!summons || !driver) {
    return <div>Summons not found</div>;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Payment successful!");
      navigate("/jpj-summons"); // Navigate back to summons list
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summons Payment</CardTitle>
          <CardDescription>
            Review summons details and process payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Driver Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Driver Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm text-muted-foreground">{driver.name}</p>
                </div>
                <div>
                  <Label>IC Number</Label>
                  <p className="text-sm text-muted-foreground">{driver.nricNumber}</p>
                </div>
                <div>
                  <Label>License Number</Label>
                  <p className="text-sm text-muted-foreground">{driver.license.number}</p>
                </div>
              </div>
            </div>

            {/* Summons Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summons Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Summons Number</Label>
                  <p className="text-sm text-muted-foreground">{summons.id}</p>
                </div>
                <div>
                  <Label>Issue Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(summons.offenseDateTime), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Offense</Label>
                  <p className="text-sm text-muted-foreground">Speeding - {summons.actualSpeed}km/h in {summons.speedLimit}km/h zone</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground">{summons.location}</p>
                </div>
                <div>
                  <Label>Vehicle Plate</Label>
                  <p className="text-sm text-muted-foreground">{summons.vehicleNumber}</p>
                </div>
              </div>
            </div>

            {/* Warning for Blacklisted Summons */}
            {summons.isBlacklisted && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Blacklisted Summons</AlertTitle>
                <AlertDescription>
                  This summons has been blacklisted. Payment is required immediately to avoid further penalties.
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    RM {summons.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label>Late Penalty</Label>
                  <p className="text-sm text-muted-foreground">
                    RM {(summons.amount * 0.1).toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Total Amount</Label>
                  <p className="text-lg font-semibold text-primary">
                    RM {(summons.amount * 1.1).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing ? "Processing Payment..." : `Pay RM ${(summons.amount * 1.1).toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
