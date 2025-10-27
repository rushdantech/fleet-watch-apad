export interface InsuranceRenewal {
  // Vehicle Information
  plateNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  chassisNumber: string;
  engineNumber: string;

  // Current Insurance Details
  currentPolicyNumber: string;
  currentPolicyExpiryDate: string;
  roadTaxExpiryDate: string;

  // Vehicle Usage
  vehicleUsageType: "heavy_vehicle" | "bus" | "commercial_passenger" | "other";
  
  // Driver Information
  drivers: {
    name: string;
    licenseNumber: string;
  }[];

  // Company Information
  companyName: string;
  
  // Contact Information
  contactEmail: string;
  contactPhone: string;

  // Changes Declaration
  changes: {
    vehicleCondition: boolean;
    extraUsage: boolean;
    modifications: boolean;
    newDrivers: boolean;
  };

  // Documents
  documents: {
    vehicleRegistration?: File;
    currentInsurancePolicy?: File;
    identityProof?: File;
    drivingLicense?: File;
    ncdCertificate?: File;
    inspectionReport?: File;
  };

  // Additional Information
  isCommercialVehicle: boolean;
  requiresSpecialAddOns: boolean;
  hasModifications: boolean;
  additionalNotes?: string;
}
