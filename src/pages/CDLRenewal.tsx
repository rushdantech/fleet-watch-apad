import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { mockDrivers } from "@/data/mockDrivers";
import { format, addYears } from "date-fns";

const RENEWAL_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PRICE_PER_YEAR = 50; // RM50 per year

export default function CDLRenewal() {
  const { driverId } = useParams();
  const [selectedYears, setSelectedYears] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Find driver from mock data
  const driver = mockDrivers.find((d) => d.id === driverId);

  if (!driver) {
    return <div>Driver not found</div>;
  }

  const currentExpiryDate = new Date(driver.license.expiryDate);
  const newExpiryDate = addYears(currentExpiryDate, selectedYears);
  const totalPrice = selectedYears * PRICE_PER_YEAR;

  const handlePayment = async () => {
    setIsProcessing(true);
    // TODO: Implement payment processing
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Payment successful! CDL renewed successfully.");
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
          <CardTitle>CDL Renewal</CardTitle>
          <CardDescription>
            Review driver details and select renewal duration
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
                <div className="col-span-2">
                  <Label>Address</Label>
                  <p className="text-sm text-muted-foreground">{driver.address || "Address not provided"}</p>
                </div>
                <div>
                  <Label>Current CDL Number</Label>
                  <p className="text-sm text-muted-foreground">{driver.license.number}</p>
                </div>
                <div>
                  <Label>Current Expiry Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(currentExpiryDate, "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {/* Renewal Duration Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Renewal Duration</h3>
              <RadioGroup
                value={selectedYears.toString()}
                onValueChange={(value) => setSelectedYears(parseInt(value))}
                className="grid grid-cols-5 gap-4"
              >
                {RENEWAL_YEARS.map((years) => (
                  <div key={years} className="flex items-center space-x-2">
                    <RadioGroupItem value={years.toString()} id={`years-${years}`} />
                    <Label htmlFor={`years-${years}`}>{years} {years === 1 ? "year" : "years"}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Summary Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Renewal Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>New Expiry Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(newExpiryDate, "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <Label>Total Price</Label>
                  <p className="text-lg font-semibold text-primary">
                    RM {totalPrice.toFixed(2)}
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
              {isProcessing ? "Processing Payment..." : `Pay RM ${totalPrice.toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
