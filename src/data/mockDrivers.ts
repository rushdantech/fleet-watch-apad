import { Driver } from "@/types/driver";
import { addDays, subDays, format } from "date-fns";

export const mockDrivers: Driver[] = [
  {
    id: "DRV001",
    name: "Ahmad Bin Abdullah",
    nricNumber: "800101-14-5567",
    phoneNumber: "012-345-6789",
    email: "ahmad.abdullah@example.com",
    status: "active",
    license: {
      number: "D1234567",
      class: ["D"],
      issueDate: "2020-01-01",
      expiryDate: "2025-01-01",
      psv: {
        number: "PSV123456",
        issueDate: "2020-01-01",
        expiryDate: "2025-01-01",
      },
    },
  },
  {
    id: "DRV002",
    name: "Siti Aminah",
    nricNumber: "850215-08-6642",
    phoneNumber: "013-456-7890",
    status: "active",
    license: {
      number: "D7654321",
      class: ["D"],
      issueDate: "2019-06-15",
      expiryDate: "2024-06-15",
    },
  },
  {
    id: "DRV003",
    name: "Raj Kumar",
    nricNumber: "780522-14-5511",
    phoneNumber: "014-567-8901",
    email: "raj.kumar@example.com",
    status: "on_leave",
    license: {
      number: "D9876543",
      class: ["D"],
      issueDate: "2021-03-10",
      expiryDate: "2026-03-10",
      psv: {
        number: "PSV987654",
        issueDate: "2021-03-10",
        expiryDate: "2026-03-10",
      },
    },
    documents: {
      nricFront: "/sample-nric-front.jpg",
      nricBack: "/sample-nric-back.jpg",
      medicalCertificate: {
        documentUrl: "/sample-medical-cert.pdf",
        issueDate: "2023-01-01",
        expiryDate: "2024-01-01",
      },
    },
  },
  {
    id: "DRV004",
    name: "Tan Wei Ming",
    nricNumber: "900330-08-5577",
    phoneNumber: "016-789-0123",
    status: "active",
    license: {
      number: "D5555555",
      class: ["D"],
      issueDate: "2022-05-20",
      expiryDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'), // License expiring soon
    },
  },
  {
    id: "DRV005",
    name: "Muhammad Hafiz",
    nricNumber: "880712-14-6633",
    phoneNumber: "017-890-1234",
    email: "hafiz.m@example.com",
    status: "suspended",
    license: {
      number: "D4444444",
      class: ["D"],
      issueDate: "2018-12-01",
      expiryDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Expired license
      psv: {
        number: "PSV444444",
        issueDate: "2018-12-01",
        expiryDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Expired PSV
      },
    },
  },
  {
    id: "DRV006",
    name: "Lee Mei Ling",
    nricNumber: "920825-08-5544",
    phoneNumber: "018-901-2345",
    status: "active",
    license: {
      number: "D3333333",
      class: ["D"],
      issueDate: "2023-01-15",
      expiryDate: "2028-01-15",
      psv: {
        number: "PSV333333",
        issueDate: "2023-01-15",
        expiryDate: "2028-01-15",
      },
    },
    documents: {
      nricFront: "/sample-nric-front.jpg",
      nricBack: "/sample-nric-back.jpg",
    },
  },
  {
    id: "DRV007",
    name: "Kumar Raju",
    nricNumber: "870603-14-7788",
    phoneNumber: "019-012-3456",
    email: "kumar.raju@example.com",
    status: "active",
    license: {
      number: "D2222222",
      class: ["D"],
      issueDate: "2020-08-30",
      expiryDate: "2025-08-30",
    },
  },
  {
    id: "DRV008",
    name: "Wong Ah Kau",
    nricNumber: "830417-08-5522",
    phoneNumber: "012-345-6780",
    status: "inactive",
    license: {
      number: "D1111111",
      class: ["D"],
      issueDate: "2019-11-20",
      expiryDate: "2024-11-20",
    },
  },
  {
    id: "DRV009",
    name: "Amir Hassan",
    nricNumber: "910702-14-5533",
    phoneNumber: "013-456-7891",
    email: "amir.h@example.com",
    status: "active",
    license: {
      number: "D8888888",
      class: ["D"],
      issueDate: "2021-07-05",
      expiryDate: "2026-07-05",
      psv: {
        number: "PSV888888",
        issueDate: "2021-07-05",
        expiryDate: "2026-07-05",
      },
    },
    documents: {
      nricFront: "/sample-nric-front.jpg",
      nricBack: "/sample-nric-back.jpg",
      medicalCertificate: {
        documentUrl: "/sample-medical-cert.pdf",
        issueDate: "2023-06-01",
        expiryDate: "2024-06-01",
      },
    },
  },
  {
    id: "DRV010",
    name: "Sarah Abdullah",
    nricNumber: "890514-08-6644",
    phoneNumber: "014-567-8902",
    status: "active",
    license: {
      number: "D7777777",
      class: ["D"],
      issueDate: "2022-03-15",
      expiryDate: "2027-03-15",
    },
  },
];