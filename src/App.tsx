import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CustomerHome from "./pages/CustomerHome";
import FieldDetails from "./pages/FieldDetails";
import BookingPage from "./pages/BookingPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/field/:id" element={<FieldDetails />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/login" element={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Owner Login</h2><p className="text-muted-foreground mb-4">Authentication requires Supabase integration</p><button onClick={() => window.location.href = '/owner/dashboard'} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg">Continue to Dashboard (Demo)</button></div></div>} />
          <Route path="/admin/login" element={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Admin Login</h2><p className="text-muted-foreground mb-4">Authentication requires Supabase integration</p><button onClick={() => window.location.href = '/admin/dashboard'} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg">Continue to Dashboard (Demo)</button></div></div>} />
          <Route path="/admin/dashboard" element={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2><p className="text-muted-foreground">Admin functionality requires Supabase integration for role-based access</p></div></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
