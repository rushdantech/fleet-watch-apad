import { mockUsers } from "@/data/mockInventory";
import type { User } from "@/types/inventory";

type AppPermission = "create" | "edit" | "delete" | "renew_insurance";

export interface CompanyDetails {
  companyName: string;
  registrationNumber: string;
  industry: string;
  phoneNumber: string;
  address: string;
}

interface AuthAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: User["role"];
  company: CompanyDetails;
}

const USERS_STORAGE_KEY = "fleettrack-auth-users";
const SESSION_STORAGE_KEY = "fleettrack-current-user";

const createDefaultAccount = (): AuthAccount => ({
  id: mockUsers[0].id,
  name: mockUsers[0].name,
  email: "admin@fleettrack.com",
  password: "admin123",
  role: mockUsers[0].role,
  company: {
    companyName: "Fleet Track Demo Sdn Bhd",
    registrationNumber: "202401234567",
    industry: "Logistics",
    phoneNumber: "+60 3-1234 5678",
    address: "Kuala Lumpur, Malaysia",
  },
});

const toUser = (account: AuthAccount): User => ({
  id: account.id,
  name: account.name,
  role: account.role,
});

const readAccounts = (): AuthAccount[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      const defaults = [createDefaultAccount()];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(stored) as AuthAccount[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = [createDefaultAccount()];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    return [createDefaultAccount()];
  }
};

const writeAccounts = (accounts: AuthAccount[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
};

const readSession = (): User | null => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

let currentUser: User | null = readSession();

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};

export const hasPermission = (permission: AppPermission) => {
  if (!currentUser) return false;

  switch (permission) {
    case "create":
    case "edit":
    case "delete":
    case "renew_insurance":
      return currentUser.role === "administrator";
    default:
      return false;
  }
};

export const isAuthenticated = () => currentUser !== null;

export const login = (email: string, password: string): { ok: boolean; message?: string } => {
  const accounts = readAccounts();
  const matchedAccount = accounts.find(
    (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password,
  );

  if (!matchedAccount) {
    return { ok: false, message: "Invalid email or password" };
  }

  setCurrentUser(toUser(matchedAccount));
  return { ok: true };
};

export const register = (input: {
  name: string;
  email: string;
  password: string;
  company: CompanyDetails;
}): { ok: boolean; message?: string } => {
  const accounts = readAccounts();
  const emailExists = accounts.some(
    (account) => account.email.toLowerCase() === input.email.toLowerCase(),
  );

  if (emailExists) {
    return { ok: false, message: "Email is already registered" };
  }

  const newAccount: AuthAccount = {
    id: `U${Date.now()}`,
    name: input.name,
    email: input.email,
    password: input.password,
    role: "administrator",
    company: input.company,
  };

  writeAccounts([newAccount, ...accounts]);
  setCurrentUser(toUser(newAccount));
  return { ok: true };
};

export const logout = () => {
  setCurrentUser(null);
};
