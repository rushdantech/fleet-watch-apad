import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string;
  documents: {
    license: {
      imageUrl: string;
      number: string;
      class: string[];
      validFrom: string;
      validTo: string;
      isExpired: boolean;
    };
    nricFront?: string;
    nricBack?: string;
    medicalCert?: {
      url: string;
      expiryDate: string;
      isExpired: boolean;
    };
  };
}

export function DocumentViewer({
  open,
  onOpenChange,
  driverName,
  documents,
}: DocumentViewerProps) {
  const getExpiryBadge = (isExpired: boolean) => {
    if (isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Valid
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Driver Documents - {driverName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="license" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="license">Driving License</TabsTrigger>
            <TabsTrigger value="nric">NRIC</TabsTrigger>
            <TabsTrigger value="medical">Medical Certificate</TabsTrigger>
          </TabsList>
          <TabsContent value="license">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">License Number</p>
                      <p className="text-sm text-muted-foreground">
                        {documents.license.number}
                      </p>
                    </div>
                    {getExpiryBadge(documents.license.isExpired)}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">License Classes</p>
                    <div className="flex gap-1 flex-wrap">
                      {documents.license.class.map((cls) => (
                        <Badge key={cls} variant="outline">
                          Class {cls}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Valid From</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(documents.license.validFrom).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Valid To</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(documents.license.validTo).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={documents.license.imageUrl}
                      alt="Driving License"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nric">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.nricFront && (
                    <div>
                      <p className="text-sm font-medium mb-2">Front</p>
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={documents.nricFront}
                          alt="NRIC Front"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                  {documents.nricBack && (
                    <div>
                      <p className="text-sm font-medium mb-2">Back</p>
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={documents.nricBack}
                          alt="NRIC Back"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medical">
            <Card>
              <CardContent className="pt-6">
                {documents.medicalCert ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Medical Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(documents.medicalCert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      {getExpiryBadge(documents.medicalCert.isExpired)}
                    </div>
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={documents.medicalCert.url}
                        alt="Medical Certificate"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No medical certificate uploaded
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
