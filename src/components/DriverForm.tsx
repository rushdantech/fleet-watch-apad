import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Driver, LicenseClass } from "@/types/driver";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const licenseClasses: { value: LicenseClass; label: string }[] = [
  { value: "A", label: "Class A - Motorcycle < 500cc" },
  { value: "B", label: "Class B - Car/Van < 3000kg" },
  { value: "C", label: "Class C - Light Commercial" },
  { value: "D", label: "Class D - Heavy Commercial" },
  { value: "E", label: "Class E - Heavy Construction" },
  { value: "F", label: "Class F - Tractor/Agriculture" },
  { value: "GDL", label: "GDL - Goods Driving License" },
  { value: "PSV", label: "PSV - Public Service Vehicle" },
];

const driverFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nricNumber: z.string().min(1, "NRIC number is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email().optional(),
  address: z.string().min(1, "Address is required"),
  license: z.object({
    number: z.string().min(1, "License number is required"),
    class: z.array(z.enum(["A", "B", "C", "D", "E", "F", "GDL", "PSV"])).min(1, "Select at least one class"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    psv: z.object({
      number: z.string().min(1, "PSV number is required"),
      expiryDate: z.string().min(1, "PSV expiry date is required"),
    }).optional(),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phoneNumber: z.string().min(1, "Emergency contact phone is required"),
  }),
  documents: z.object({
    nricFront: z.any().optional(),
    nricBack: z.any().optional(),
    photo: z.any().optional(),
    medicalCertificate: z.object({
      documentUrl: z.any(),
      expiryDate: z.string().min(1, "Medical certificate expiry date is required"),
    }),
  }),
});

interface DriverFormProps {
  initialData?: Partial<Driver>;
  onSubmit: (data: z.infer<typeof driverFormSchema>) => void;
  onCancel: () => void;
}

export function DriverForm({ initialData, onSubmit, onCancel }: DriverFormProps) {
  const form = useForm<z.infer<typeof driverFormSchema>>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      nricNumber: initialData?.nricNumber || "",
      phoneNumber: initialData?.phoneNumber || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      license: {
        number: initialData?.license?.number || "",
        class: initialData?.license?.class || [],
        issueDate: initialData?.license?.issueDate || "",
        expiryDate: initialData?.license?.expiryDate || "",
        psv: initialData?.license?.psv || undefined,
      },
      emergencyContact: {
        name: initialData?.emergencyContact?.name || "",
        relationship: initialData?.emergencyContact?.relationship || "",
        phoneNumber: initialData?.emergencyContact?.phoneNumber || "",
      },
      documents: {
        medicalCertificate: {
          documentUrl: "",
          expiryDate: initialData?.documents?.medicalCertificate?.expiryDate || "",
        },
      },
    },
  });

  const watchLicenseClass = form.watch("license.class");
  const hasPSV = watchLicenseClass.includes("PSV");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nricNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRIC Number*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address*</FormLabel>
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
            <CardTitle>License Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="license.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="license.class"
                  render={() => (
                    <FormItem>
                      <FormLabel>License Classes*</FormLabel>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {licenseClasses.map((item) => (
                          <FormField
                            key={item.value}
                            control={form.control}
                            name="license.class"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="license.issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license.expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {hasPSV && (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="license.psv.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PSV License Number*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="license.psv.expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PSV Expiry Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="emergencyContact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact.phoneNumber"
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
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="documents.nricFront"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRIC Front*</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.nricBack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRIC Back*</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Photo*</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.medicalCertificate.documentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Certificate*</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.medicalCertificate.expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Certificate Expiry*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Driver</Button>
        </div>
      </form>
    </Form>
  );
}
