import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getVehicles } from "@/lib/vehicles";
import type { VehicleInventory } from "@/types/inventory";
import type { InsuranceRenewal } from "@/types/insurance";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const insuranceRenewalSchema = z.object({
  // Vehicle Information
  plateNumber: z.string().min(1, "Required"),
  make: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  yearOfManufacture: z.coerce.number().min(1900).max(new Date().getFullYear()),
  chassisNumber: z.string().min(1, "Required"),
  engineNumber: z.string().min(1, "Required"),

  // Current Insurance Details
  currentPolicyNumber: z.string().min(1, "Required"),
  currentPolicyExpiryDate: z.string().min(1, "Required"),
  roadTaxExpiryDate: z.string().min(1, "Required"),

  // Vehicle Usage
  vehicleUsageType: z.enum(["heavy_vehicle", "bus", "commercial_passenger", "other"]),

  // Driver Information
  drivers: z.array(z.object({
    name: z.string().min(1, "Required"),
    licenseNumber: z.string().min(1, "Required"),
  })),

  // Company Information
  companyName: z.string().min(1, "Required"),

  // Contact Information
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10, "Invalid phone number"),

  // Changes Declaration
  changes: z.object({
    vehicleCondition: z.boolean(),
    extraUsage: z.boolean(),
    modifications: z.boolean(),
    newDrivers: z.boolean(),
  }),

  // Additional Information
  isCommercialVehicle: z.boolean(),
  requiresSpecialAddOns: z.boolean(),
  hasModifications: z.boolean(),
  additionalNotes: z.string().optional(),
});

export default function InsuranceRenewal() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleInventory | null>(null);

  useEffect(() => {
    if (vehicleId) {
      const vehicles = getVehicles();
      const foundVehicle = vehicles.find(v => v.id === vehicleId);
      if (foundVehicle) {
        setVehicle(foundVehicle);
      } else {
        navigate("/vehicle-inventory");
      }
    }
  }, [vehicleId, navigate]);

  const form = useForm<z.infer<typeof insuranceRenewalSchema>>({
    resolver: zodResolver(insuranceRenewalSchema),
    defaultValues: {
      plateNumber: vehicle?.plateNumber || "",
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      yearOfManufacture: vehicle?.year || new Date().getFullYear(),
      chassisNumber: vehicle?.chassisNumber || "",
      engineNumber: vehicle?.engineNumber || "",
      currentPolicyNumber: vehicle?.insurance.policyNumber || "",
      currentPolicyExpiryDate: vehicle?.insurance.expiryDate || "",
      roadTaxExpiryDate: vehicle?.roadTax.expiryDate || "",
      vehicleUsageType: "other",
      drivers: vehicle?.driver ? [{ name: vehicle.driver, licenseNumber: "" }] : [],
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      changes: {
        vehicleCondition: false,
        extraUsage: false,
        modifications: false,
        newDrivers: false,
      },
      isCommercialVehicle: false,
      requiresSpecialAddOns: false,
      hasModifications: false,
    },
  });

  const onSubmit = (data: z.infer<typeof insuranceRenewalSchema>) => {
    console.log(data);
    // TODO: Implement actual submission
  };

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insurance Renewal</h1>
        <p className="text-muted-foreground">
          Renew insurance for vehicle {vehicle.plateNumber}
        </p>
      </div>

      {vehicle.insurance.expiryDate && new Date(vehicle.insurance.expiryDate) < new Date() && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            The current insurance policy has expired. Please ensure there are no gaps in coverage.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>Basic vehicle details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Registration / Plate Number*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Manufacture*</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chassisNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chassis Number*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Number*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Insurance Details</CardTitle>
              <CardDescription>Information about the current policy</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currentPolicyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Policy Number*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPolicyExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Policy Expiry Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roadTaxExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Road Tax Expiry Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleUsageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Usage Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="heavy_vehicle">Heavy Vehicle</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="commercial_passenger">Commercial Passenger</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company & Contact Information</CardTitle>
              <CardDescription>Details for communication</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email*</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes Declaration</CardTitle>
              <CardDescription>Declare any changes since last policy</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="changes.vehicleCondition"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Change in vehicle condition</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="changes.extraUsage"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Extra usage</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="changes.modifications"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Vehicle modifications</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="changes.newDrivers"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">New drivers</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload all necessary documents</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormItem>
                <FormLabel>Vehicle Registration Card*</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload scan/photo of vehicle registration card, e-grant, or vehicle log card
                </FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Current Insurance Certificate*</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload current/expired insurance certificate or policy document
                </FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Identity Proof*</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload NRIC/MyKad or company registration details
                </FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Driving License</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload driving license of main driver (if required)
                </FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>NCD Certificate</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload No Claim Discount certificate or proof of claim-free years
                </FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Inspection Report</FormLabel>
                <FormControl>
                  <Input type="file" accept={ACCEPTED_FILE_TYPES.join(",")} />
                </FormControl>
                <FormDescription>
                  Upload vehicle inspection report (if required for heavy/commercial vehicles)
                </FormDescription>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any other relevant information</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional information or special requirements..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/vehicle-inventory")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Renewal</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
