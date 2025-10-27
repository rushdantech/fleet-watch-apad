export interface ServiceTask {
  id: string;
  name: string;
  category: string;
  interval?: {
    distance?: number; // in km
    time?: number; // in days
    description: string;
  };
  completed: boolean;
  notes?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  tasks: ServiceTask[];
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceDate: string;
  mileage: number;
  completedTasks: ServiceTask[];
  additionalNotes?: string;
  createdAt: string;
  createdBy: string;
  cost?: number;
}

export interface VehicleMaintenance {
  vehicleId: string;
  plateNumber: string;
  lastMileage: number;
  lastServiceDate: string;
  nextServiceDate: string;
  serviceHistory: ServiceRecord[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "tyres",
    name: "Tyres & Wheels",
    icon: "circle",
    tasks: [
      {
        id: "tyre-pressure",
        name: "Tyre pressure check",
        category: "tyres",
        interval: { time: 7, description: "Weekly" },
        completed: false
      },
      {
        id: "tread-depth",
        name: "Tread depth check",
        category: "tyres",
        interval: { time: 30, description: "Monthly" },
        completed: false
      },
      {
        id: "rotation-alignment",
        name: "Rotation & alignment",
        category: "tyres",
        interval: { distance: 10000, description: "Every 10,000-15,000 km" },
        completed: false
      },
      {
        id: "balancing",
        name: "Wheel balancing",
        category: "tyres",
        interval: { description: "When vibration observed" },
        completed: false
      },
      {
        id: "spare-tyre",
        name: "Spare tyre condition",
        category: "tyres",
        interval: { time: 30, description: "Monthly" },
        completed: false
      }
    ]
  },
  {
    id: "engine",
    name: "Engine & Lubrication",
    icon: "settings2",
    tasks: [
      {
        id: "engine-oil",
        name: "Engine oil level & change",
        category: "engine",
        interval: { distance: 10000, description: "Every 10,000-15,000 km" },
        completed: false
      },
      {
        id: "oil-filter",
        name: "Oil filter replacement",
        category: "engine",
        interval: { description: "With every oil change" },
        completed: false
      },
      {
        id: "air-filter",
        name: "Air filter inspection/replacement",
        category: "engine",
        interval: { distance: 20000, description: "Replace every 20,000-30,000 km" },
        completed: false
      },
      {
        id: "fuel-filter",
        name: "Fuel filter replacement",
        category: "engine",
        interval: { distance: 20000, description: "Every 20,000-40,000 km" },
        completed: false
      },
      {
        id: "coolant",
        name: "Coolant level & quality",
        category: "engine",
        interval: { description: "As per manufacturer" },
        completed: false
      },
      {
        id: "belts",
        name: "Belt inspection",
        category: "engine",
        interval: { distance: 20000, description: "Every 20,000 km" },
        completed: false
      },
      {
        id: "battery",
        name: "Battery health check",
        category: "engine",
        interval: { time: 30, description: "Monthly" },
        completed: false
      }
    ]
  },
  {
    id: "transmission",
    name: "Transmission & Drivetrain",
    icon: "cog",
    tasks: [
      {
        id: "transmission-fluid",
        name: "Transmission fluid check",
        category: "transmission",
        interval: { description: "As recommended" },
        completed: false
      },
      {
        id: "clutch",
        name: "Clutch system inspection",
        category: "transmission",
        interval: { description: "Regular inspection" },
        completed: false
      },
      {
        id: "differential",
        name: "Differential oil replacement",
        category: "transmission",
        interval: { distance: 40000, description: "Every 40,000-60,000 km" },
        completed: false
      }
    ]
  },
  {
    id: "brakes",
    name: "Brakes & Suspension",
    icon: "disc",
    tasks: [
      {
        id: "brake-fluid",
        name: "Brake fluid change",
        category: "brakes",
        interval: { distance: 40000, time: 730, description: "Every 2 years or 40,000 km" },
        completed: false
      },
      {
        id: "brake-pads",
        name: "Brake pads/shoes inspection",
        category: "brakes",
        interval: { distance: 10000, description: "Every 10,000 km" },
        completed: false
      },
      {
        id: "disc-drum",
        name: "Disc/drum condition check",
        category: "brakes",
        interval: { description: "Regular inspection" },
        completed: false
      },
      {
        id: "shock-absorbers",
        name: "Shock absorbers inspection",
        category: "brakes",
        interval: { description: "Regular inspection" },
        completed: false
      },
      {
        id: "suspension",
        name: "Suspension bushings check",
        category: "brakes",
        interval: { description: "Regular inspection" },
        completed: false
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical & Lighting",
    icon: "zap",
    tasks: [
      {
        id: "lights",
        name: "All lights check",
        category: "electrical",
        interval: { time: 1, description: "Daily" },
        completed: false
      },
      {
        id: "accessories",
        name: "Horn, wipers, indicators check",
        category: "electrical",
        interval: { time: 1, description: "Daily" },
        completed: false
      },
      {
        id: "alternator",
        name: "Alternator & starter test",
        category: "electrical",
        interval: { description: "During service" },
        completed: false
      }
    ]
  },
  {
    id: "body",
    name: "Body, Interior & Safety",
    icon: "truck",
    tasks: [
      {
        id: "seatbelts",
        name: "Seat belts inspection",
        category: "body",
        interval: { description: "Regular check" },
        completed: false
      },
      {
        id: "mirrors",
        name: "Mirrors and glass inspection",
        category: "body",
        interval: { time: 1, description: "Daily" },
        completed: false
      },
      {
        id: "doors",
        name: "Doors & locks check",
        category: "body",
        interval: { description: "Regular check" },
        completed: false
      },
      {
        id: "safety-equipment",
        name: "Safety equipment check",
        category: "body",
        interval: { time: 30, description: "Monthly" },
        completed: false
      },
      {
        id: "signage",
        name: "Public vehicle signage check",
        category: "body",
        interval: { time: 30, description: "Monthly" },
        completed: false
      }
    ]
  },
  {
    id: "fuel",
    name: "Fuel & Emissions",
    icon: "fuel",
    tasks: [
      {
        id: "consumption",
        name: "Fuel consumption logging",
        category: "fuel",
        interval: { description: "Continuous tracking" },
        completed: false
      },
      {
        id: "emissions",
        name: "Exhaust & emission check",
        category: "fuel",
        interval: { description: "During service" },
        completed: false
      },
      {
        id: "fuel-leaks",
        name: "Fuel tank leak inspection",
        category: "fuel",
        interval: { description: "Regular check" },
        completed: false
      }
    ]
  },
  {
    id: "admin",
    name: "Administrative & Compliance",
    icon: "clipboard",
    tasks: [
      {
        id: "insurance",
        name: "Insurance & road tax check",
        category: "admin",
        interval: { description: "As per expiry" },
        completed: false
      },
      {
        id: "puspakom",
        name: "Puspakom inspection",
        category: "admin",
        interval: { description: "As scheduled" },
        completed: false
      },
      {
        id: "maintenance-logs",
        name: "Maintenance log update",
        category: "admin",
        interval: { description: "After each service" },
        completed: false
      }
    ]
  }
];