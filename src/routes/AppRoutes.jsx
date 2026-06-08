import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard";
import DeploymentDetails from "../pages/DeploymentDetails";
import NotFound from "../pages/NotFound";
import CreateDeployment from "../pages/CreateDeployment";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import ProjectDetails from "../pages/ProjectDetails";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deployments/:id"
        element={
          <ProtectedRoute>
            <DeploymentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deploy"
        element={
          <ProtectedRoute>
            <CreateDeployment />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}