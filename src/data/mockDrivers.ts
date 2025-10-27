import { Driver } from "@/types/driver";

// Helper function to generate dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const mockDrivers: Driver[] = [
  {
    id: "D001",
    name: "Ahmad bin Abdullah",
    nricNumber: "800101-14-5567",
    phoneNumber: "012-3456789",
    email: "ahmad@example.com",
    address: "123, Jalan Ampang, 50450 Kuala Lumpur",
    status: "active",
    license: {
      number: "KL80101145567",
      class: ["E", "PSV"],
      issueDate: getDate(-730), // 2 years ago
      expiryDate: getDate(180), // 6 months ahead
      psv: {
        number: "PSV12345",
        expiryDate: getDate(150),
      }
    },
    emergencyContact: {
      name: "Aminah binti Abdullah",
      relationship: "Spouse",
      phoneNumber: "012-9876543"
    },
    assignedVehicle: "V001",
    joiningDate: getDate(-365),
    documents: {
      nricFront: "nric_front_d001.jpg",
      nricBack: "nric_back_d001.jpg",
      photo: "photo_d001.jpg",
      medicalCertificate: {
        documentUrl: "medical_d001.pdf",
        expiryDate: getDate(240),
      },
      trainingCertificates: [
        {
          name: "Defensive Driving",
          issueDate: getDate(-180),
          expiryDate: getDate(180),
          documentUrl: "cert_defensive_d001.pdf"
        }
      ]
    },
    createdBy: "U001",
    createdAt: getDate(-365),
  },
  {
    id: "D002",
    name: "Tan Wei Ming",
    nricNumber: "850215-10-5577",
    phoneNumber: "012-2223333",
    email: "tanwm@example.com",
    address: "45, Jalan Pasar, 11600 Penang",
    status: "active",
    license: {
      number: "P85021510557",
      class: ["E"],
      issueDate: getDate(-365),
      expiryDate: getDate(30), // Expiring soon
    },
    emergencyContact: {
      name: "Tan Mei Ling",
      relationship: "Sister",
      phoneNumber: "012-4445555"
    },
    assignedVehicle: "V002",
    joiningDate: getDate(-180),
    documents: {
      nricFront: "nric_front_d002.jpg",
      nricBack: "nric_back_d002.jpg",
      photo: "photo_d002.jpg",
      medicalCertificate: {
        documentUrl: "medical_d002.pdf",
        expiryDate: getDate(45),
      }
    },
    createdBy: "U001",
    createdAt: getDate(-180),
  },
  {
    id: "D003",
    name: "Kumar Selvam",
    nricNumber: "780522-14-5511",
    phoneNumber: "012-6667777",
    address: "78, Jalan Merdeka, 80000 Johor Bahru",
    status: "on_leave",
    license: {
      number: "J78052214551",
      class: ["E", "GDL"],
      issueDate: getDate(-545),
      expiryDate: getDate(90),
      psv: {
        number: "PSV67890",
        expiryDate: getDate(-15), // Expired
      }
    },
    emergencyContact: {
      name: "Lakshmi",
      relationship: "Mother",
      phoneNumber: "012-8889999"
    },
    assignedVehicle: "V003",
    joiningDate: getDate(-730),
    documents: {
      nricFront: "nric_front_d003.jpg",
      nricBack: "nric_back_d003.jpg",
      photo: "photo_d003.jpg",
      medicalCertificate: {
        documentUrl: "medical_d003.pdf",
        expiryDate: getDate(120),
      },
      trainingCertificates: [
        {
          name: "Hazmat Transportation",
          issueDate: getDate(-90),
          expiryDate: getDate(275),
          documentUrl: "cert_hazmat_d003.pdf"
        }
      ]
    },
    createdBy: "U001",
    createdAt: getDate(-730),
    modifiedBy: "U001",
    modifiedAt: getDate(-1),
  }
];
