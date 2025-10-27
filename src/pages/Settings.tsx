import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Mail, Phone } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const notificationFormSchema = z.object({
  email: z.string().email("Please enter a valid email").optional(),
  whatsapp: z.string()
    .regex(/^\+?6?01[0-46-9]-*[0-9]{7,8}$/, "Please enter a valid Malaysian phone number")
    .optional(),
  summons_notification: z.string(),
  license_notification: z.string(),
  insurance_notification: z.string(),
  roadtax_notification: z.string(),
  summons_advance_notice: z.number().min(1).max(90),
  license_advance_notice: z.number().min(1).max(90),
  insurance_advance_notice: z.number().min(1).max(90),
  roadtax_advance_notice: z.number().min(1).max(90),
});

const notificationOptions = [
  { value: "none", label: "No Notifications" },
  { value: "email", label: "Email Only" },
  { value: "whatsapp", label: "WhatsApp Only" },
  { value: "both", label: "Both Email & WhatsApp" },
];

const Settings = () => {
  const form = useForm({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      email: "",
      whatsapp: "",
      summons_notification: "none",
      license_notification: "none",
      insurance_notification: "none",
      roadtax_notification: "none",
      summons_advance_notice: 30,
      license_advance_notice: 30,
      insurance_advance_notice: 30,
      roadtax_advance_notice: 30,
    },
  });

  const onSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    console.log(data);
    // TODO: Implement settings save
  };

  const NotificationSection = ({ 
    title, 
    description, 
    fieldName, 
    advanceNoticeField 
  }: { 
    title: string;
    description: string;
    fieldName: "summons_notification" | "license_notification" | "insurance_notification" | "roadtax_notification";
    advanceNoticeField: "summons_advance_notice" | "license_advance_notice" | "insurance_advance_notice" | "roadtax_advance_notice";
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {notificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={advanceNoticeField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advance Notice (Days)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={90}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Days in advance to send notification
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how you want to be notified about various events</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contact Information</Label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="Email address" {...field} />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="WhatsApp number (e.g., 601X-XXXXXXX)" {...field} />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <NotificationSection
                title="JPJ Summons Notifications"
                description="Choose how you want to be notified about new summons"
                fieldName="summons_notification"
                advanceNoticeField="summons_advance_notice"
              />

              <Separator />

              <NotificationSection
                title="Driving License Notifications"
                description="Choose how you want to be notified about license expiry"
                fieldName="license_notification"
                advanceNoticeField="license_advance_notice"
              />

              <Separator />

              <NotificationSection
                title="Insurance Notifications"
                description="Choose how you want to be notified about insurance expiry"
                fieldName="insurance_notification"
                advanceNoticeField="insurance_advance_notice"
              />

              <Separator />

              <NotificationSection
                title="Road Tax Notifications"
                description="Choose how you want to be notified about road tax expiry"
                fieldName="roadtax_notification"
                advanceNoticeField="roadtax_advance_notice"
              />

              <Button type="submit">Save Notification Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Alert Thresholds
          </CardTitle>
          <CardDescription>Configure alert triggers for vehicle monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="overspeed">Overspeed Threshold (km/h)</Label>
              <Input id="overspeed" type="number" defaultValue="80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idle">Idle Time Alert (minutes)</Label>
              <Input id="idle" type="number" defaultValue="15" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Harsh Braking Detection</Label>
              <p className="text-sm text-muted-foreground">Enable alerts for sudden braking events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Harsh Acceleration Detection</Label>
              <p className="text-sm text-muted-foreground">Enable alerts for rapid acceleration</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" defaultValue="Fleet Track Sdn Bhd" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue="GMT+8 (Malaysia)" />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;