import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleInventory from "./pages/VehicleInventory";
import InsuranceRenewal from "./pages/InsuranceRenewal";
import BulkInsuranceRenewal from "./pages/BulkInsuranceRenewal";
import VehicleMapView from "./pages/VehicleMapView";
import Maintenance from "./pages/Maintenance";
import ServiceHistory from "./pages/ServiceHistory";
import ServiceRecordDetail from "./pages/ServiceRecordDetail";
import NewServiceRecord from "./pages/NewServiceRecord";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import JPJSummons from "./pages/JPJSummons";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HashRouter>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1">
              <DashboardHeader />
              <main className="p-4 md:p-6">
                <Routes>
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
                  <Route path="/jpj-summons" element={<JPJSummons />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;