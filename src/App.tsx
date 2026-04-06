import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChildProvider } from "@/contexts/ChildContext";
import { ProtectedRoute, RequireChild } from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";

// Auth
import AuthPage from "@/pages/AuthPage";

// Parent App
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

// Student App
import StudentLayout from "@/components/StudentLayout";
import StudentHome from "@/pages/student/StudentHome";
import LessonPage from "@/pages/student/LessonPage";
import PracticePage from "@/pages/student/PracticePage";
import JourneyPage from "@/pages/student/JourneyPage";
import StudentProfilePage from "@/pages/student/StudentProfilePage";

// Admin App
import AdminLayout from "@/components/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import StudentsPage from "@/pages/admin/StudentsPage";
import ParentsPage from "@/pages/admin/ParentsPage";
import LinksPage from "@/pages/admin/LinksPage";
import CurriculumPage from "@/pages/admin/CurriculumPage";
import AdminSchedulePage from "@/pages/admin/AdminSchedulePage";
import AdminAttendancePage from "@/pages/admin/AdminAttendancePage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminBillingPage from "@/pages/admin/AdminBillingPage";
import InvoicesPage from "@/pages/admin/InvoicesPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminSupportPage from "@/pages/admin/AdminSupportPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

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
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Parent App Routes */}
              <Route path="/link-child" element={<RoleGuard allowedRole="parent"><LinkChildPage /></RoleGuard>} />
              <Route path="/child-selector" element={<RoleGuard allowedRole="parent"><ChildSelectorPage /></RoleGuard>} />
              <Route path="/dashboard" element={<RoleGuard allowedRole="parent"><RequireChild><DashboardLayout /></RequireChild></RoleGuard>}>
                <Route index element={<DashboardHome />} />
                <Route path="learning" element={<LearningPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>

              {/* Student App Routes */}
              <Route path="/student" element={<RoleGuard allowedRole="student"><StudentLayout /></RoleGuard>}>
                <Route index element={<StudentHome />} />
                <Route path="lesson" element={<LessonPage />} />
                <Route path="practice" element={<PracticePage />} />
                <Route path="journey" element={<JourneyPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Admin App Routes */}
              <Route path="/admin" element={<RoleGuard allowedRole="admin"><AdminLayout /></RoleGuard>}>
                <Route index element={<AdminHome />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="parents" element={<ParentsPage />} />
                <Route path="links" element={<LinksPage />} />
                <Route path="curriculum" element={<CurriculumPage />} />
                <Route path="schedule" element={<AdminSchedulePage />} />
                <Route path="attendance" element={<AdminAttendancePage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="billing" element={<AdminBillingPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="support" element={<AdminSupportPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
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
