import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth.tsx";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CustomerDashboard from "@/pages/customer-dashboard";
import QRCode from "@/pages/qr-code";
import StampHistory from "@/pages/stamp-history";
import Profile from "@/pages/profile";
import ManagerLogin from "@/pages/manager-login";
import ManagerDashboard from "@/pages/manager-dashboard";
import CustomerValidation from "@/pages/customer-validation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={CustomerDashboard} />
      <Route path="/qr-code" component={QRCode} />
      <Route path="/history" component={StampHistory} />
      <Route path="/profile" component={Profile} />
      <Route path="/manager" component={ManagerLogin} />
      <Route path="/manager/dashboard" component={ManagerDashboard} />
      <Route path="/manager/validate/:qrCode" component={CustomerValidation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-bg fade-in">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
