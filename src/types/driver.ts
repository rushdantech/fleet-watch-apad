export type DriverStatus = "active" | "inactive" | "on_leave" | "suspended";
export type LicenseClass = "A" | "B" | "C" | "D" | "E" | "F" | "GDL" | "PSV";

export interface DriverLicense {
  number: string;
  class: LicenseClass[];
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  psv?: {
    number: string;
    expiryDate: string;
    documentUrl?: string;
  };
}

export interface Driver {
  id: string;
  name: string;
  nricNumber: string;
  phoneNumber: string;
  email?: string;
  address: string;
  status: DriverStatus;
  license: DriverLicense;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  assignedVehicle?: string; // Vehicle ID
  joiningDate: string;
  documents: {
    nricFront?: string;
    nricBack?: string;
    photo?: string;
    medicalCertificate?: {
      documentUrl: string;
      expiryDate: string;
    };
    trainingCertificates?: Array<{
      name: string;
      issueDate: string;
      expiryDate?: string;
      documentUrl: string;
    }>;
  };
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}
