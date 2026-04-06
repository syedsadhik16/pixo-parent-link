import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChildProvider } from "@/contexts/ChildContext";
import { ProtectedRoute, RequireChild } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import LinkChildPage from "@/pages/LinkChildPage";
import ChildSelectorPage from "@/pages/ChildSelectorPage";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHome from "@/pages/DashboardHome";
import LearningPage from "@/pages/LearningPage";
import ActivityPage from "@/pages/ActivityPage";
import SchedulePage from "@/pages/SchedulePage";
import ReportsPage from "@/pages/ReportsPage";
import BillingPage from "@/pages/BillingPage";
import ProfilePage from "@/pages/ProfilePage";
import SupportPage from "@/pages/SupportPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ChildProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/link-child" element={<ProtectedRoute><LinkChildPage /></ProtectedRoute>} />
              <Route path="/child-selector" element={<ProtectedRoute><ChildSelectorPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><RequireChild><DashboardLayout /></RequireChild></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="learning" element={<LearningPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChildProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
