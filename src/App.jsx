import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import ResidentDashboard from "./pages/resident/ResidentDashboard";
import ResidentProfile from "./pages/resident/ResidentProfile";
import Complaints from "./pages/resident/Complaints";
import ResidentVisitors from "./pages/resident/ResidentVisitors";
import ResidentVisitorDetails from "./pages/resident/ResidentVisitorDetails";
import ResidentMaintenance from "./pages/resident/ResidentMaintenance";
import ResidentEvents from "./pages/resident/ResidentEvents";
import ResidentNotices from "./pages/resident/ResidentNotices";
import FacilityBookings from "./pages/resident/FacilityBookings";
import ResidentPolls from "./pages/resident/ResidentPolls";
import ResidentEmergency from "./pages/resident/ResidentEmergency";
import ResidentSettings from "./pages/resident/ResidentSettings";
import ResidentGuidelines from "./pages/resident/ResidentGuidelines";
import ResidentVisitorRequests from "./pages/resident/ResidentVisitorRequests";
import VisitorPanel from "./pages/visitor/VisitorPanel";
import VisitorRequest from "./pages/visitor/VisitorRequest";
import VisitorPasses from "./pages/visitor/VisitorPasses";
import VisitorProfile from "./pages/visitor/VisitorProfile";
import VisitorMap from "./pages/visitor/VisitorMap";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminResidents from "./pages/admin/AdminResidents";
import AdminFlats from "./pages/admin/AdminFlats";
import MaintenanceBills from "./pages/admin/MaintenanceBills";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminPolls from "./pages/admin/AdminPolls";
import StaffGuards from "./pages/admin/StaffGuards";
import AdminCompletedComplaints from "./pages/admin/AdminCompletedComplaints";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import SocietyMap from "./pages/admin/SocietyMap";

import GuardDashboard from "./pages/guard/GuardDashboard";
import VerifyGatePass from "./pages/guard/VerifyGatePass";
import WalkInVisitor from "./pages/guard/WalkInVisitor";
import ActiveVisitors from "./pages/guard/ActiveVisitors";
import EntryLogs from "./pages/guard/EntryLogs";
import ExitLogs from "./pages/guard/ExitLogs";
import GuardProfile from "./pages/guard/GuardProfile";
import GuardSettings from "./pages/guard/GuardSettings";
import OverstayAlerts from "./pages/guard/OverstayAlerts";
import AllVisitors from "./pages/guard/AllVisitors";


import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAssignedComplaints from "./pages/staff/StaffAssignedComplaints";
import StaffInProgress from "./pages/staff/StaffInProgress";
import StaffCompletedWork from "./pages/staff/StaffCompletedWork";
import StaffComplaintHistory from "./pages/staff/StaffComplaintHistory";
import StaffSettings from "./pages/staff/StaffSettings";
import StaffProfile from "./pages/staff/StaffProfile";



function App() {
  return (

    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    <Routes>


      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/visitor" element={<ProtectedRoute role="visitor"><VisitorPanel /></ProtectedRoute>} />
      <Route path="/visitor/request" element={<ProtectedRoute role="visitor"><VisitorRequest /></ProtectedRoute>} />
      <Route path="/visitor/passes" element={<ProtectedRoute role="visitor"><VisitorPasses /></ProtectedRoute>} />
      <Route path="/visitor/profile" element={<ProtectedRoute role="visitor"><VisitorProfile /></ProtectedRoute>} />
      <Route path="/visitor/map" element={<ProtectedRoute role="visitor"><VisitorMap /></ProtectedRoute>} />
      <Route path="/visitor/notifications" element={<ProtectedRoute role="visitor"><Notifications role="visitor" /></ProtectedRoute>} />




      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><Notifications role="admin" /></ProtectedRoute>} />
      <Route
        path="/admin/society-map"
        element={
          <ProtectedRoute role="admin">
            <SocietyMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute role="admin">
            <AdminComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/residents"
        element={
          <ProtectedRoute role="admin">
            <AdminResidents />
          </ProtectedRoute>
        }
      />
        <Route
          path="/admin/flats"
          element={
            <ProtectedRoute role="admin">
              <AdminFlats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bills"
          element={
            <ProtectedRoute role="admin">
              <MaintenanceBills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/security"
          element={
            <ProtectedRoute role="admin">
              <AdminSecurity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/facilities"
          element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute role="admin">
              <AdminNotices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls"
          element={
            <ProtectedRoute role="admin">
              <AdminPolls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute role="admin">
              <StaffGuards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/completed-complaints"
          element={
            <ProtectedRoute role="admin">
              <AdminCompletedComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute role="admin">
              <AdminAuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

      <Route
        path="/resident"
        element={
          <ProtectedRoute role="resident">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/resident/notifications" element={<ProtectedRoute role="resident"><Notifications role="resident" /></ProtectedRoute>} />
        <Route
          path="/resident/profile"
          element={
            <ProtectedRoute role="resident">
              <ResidentProfile />
            </ProtectedRoute>
          }
        />
      <Route
        path="/resident/complaints"
        element={
          <ProtectedRoute role="resident">
            <Complaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/visitor-passes"
        element={
          <ProtectedRoute role="resident">
            <ResidentVisitors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/visitor-requests"
        element={
          <ProtectedRoute role="resident">
            <ResidentVisitorRequests />
          </ProtectedRoute>
        }
      />
        <Route
          path="/resident/visitors/:id"
          element={
            <ProtectedRoute role="resident">
              <ResidentVisitorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/visitors-details"
          element={
            <ProtectedRoute role="resident">
              <ResidentVisitorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/bills"
          element={
            <ProtectedRoute role="resident">
              <ResidentMaintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/events"
          element={
            <ProtectedRoute role="resident">
              <ResidentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/notices"
          element={
            <ProtectedRoute role="resident">
              <ResidentNotices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/bookings"
          element={
            <ProtectedRoute role="resident">
              <FacilityBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/polls"
          element={
            <ProtectedRoute role="resident">
              <ResidentPolls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/emergency"
          element={
            <ProtectedRoute role="resident">
              <ResidentEmergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/guidelines"
          element={
            <ProtectedRoute role="resident">
              <ResidentGuidelines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/settings"
          element={
            <ProtectedRoute role="resident">
              <ResidentSettings />
            </ProtectedRoute>
          }
        />



      <Route
        path="/guard"
        element={
          <ProtectedRoute role="guard">
            <GuardDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/guard/notifications" element={<ProtectedRoute role="guard"><Notifications role="guard" /></ProtectedRoute>} />
        <Route
          path="/guard/verify-pass"
          element={
            <ProtectedRoute role="guard">
              <VerifyGatePass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/walk-in"
          element={
            <ProtectedRoute role="guard">
              <WalkInVisitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/active-visitors"
          element={
            <ProtectedRoute role="guard">
              <ActiveVisitors />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/guard/entry-logs"
          element={
            <ProtectedRoute role="guard">
              <EntryLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/exit-logs"
          element={
            <ProtectedRoute role="guard">
              <ExitLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/alerts"
          element={
            <ProtectedRoute role="guard">
              <OverstayAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/profile"
          element={
            <ProtectedRoute role="guard">
              <GuardProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/settings"
          element={
            <ProtectedRoute role="guard">
              <GuardSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/all-visitors"
          element={
            <ProtectedRoute role="guard">
              <AllVisitors />
            </ProtectedRoute>
          }
        />


      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/staff/notifications" element={<ProtectedRoute role="staff"><Notifications role="staff" /></ProtectedRoute>} />
      <Route
        path="/staff/assigned"
        element={
          <ProtectedRoute role="staff">
            <StaffAssignedComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/in-progress"
        element={
          <ProtectedRoute role="staff">
            <StaffInProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/completed"
        element={
          <ProtectedRoute role="staff">
            <StaffCompletedWork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/history"
        element={
          <ProtectedRoute role="staff">
            <StaffComplaintHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute role="staff">
            <StaffProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/settings"
        element={
          <ProtectedRoute role="staff">
            <StaffSettings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />


    </Routes>

    </>
  );
}

export default App;
