import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { isAuthenticated } from "@/lib/auth";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleInventory from "./pages/VehicleInventory";
import InsuranceRenewal from "./pages/InsuranceRenewal";
import BulkInsuranceRenewal from "./pages/BulkInsuranceRenewal";
import VehicleMapView from "./pages/VehicleMapView";
import Maintenance from "./pages/Maintenance";
import ServiceHistory from "./pages/ServiceHistory";
import ServiceRecordDetail from "./pages/ServiceRecordDetail";
import DriverSummons from "./pages/DriverSummons";
import NewServiceRecord from "./pages/NewServiceRecord";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import JPJSummons from "./pages/JPJSummons";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CDLRenewal from "./pages/CDLRenewal";
import SummonsPayment from "./pages/SummonsPayment";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicle-inventory" element={<VehicleInventory />} />
              <Route path="/insurance-renewal/:vehicleId" element={<InsuranceRenewal />} />
              <Route path="/bulk-insurance-renewal" element={<BulkInsuranceRenewal />} />
              <Route path="/vehicle-map/:vehicleId" element={<VehicleMapView />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/service-history" element={<ServiceHistory />} />
              <Route path="/service-record/:id" element={<ServiceRecordDetail />} />
              <Route path="/service-record/new" element={<NewServiceRecord />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/new" element={<AddDriver />} />
              <Route path="/driver-summons/:driverId" element={<DriverSummons />} />
              <Route path="/jpj-summons" element={<JPJSummons />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/drivers/:driverId/cdl-renewal" element={<CDLRenewal />} />
              <Route path="/summons/:summonsId/payment" element={<SummonsPayment />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;