import {
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import DeploymentDetails from "../pages/DeploymentDetails";
import NotFound from "../pages/NotFound";
import CreateDeployment
from "../pages/CreateDeployment";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/deployments/:id"
        element={
          <DeploymentDetails />
        }
      />
      <Route
        path="/deploy"
        element={
          <CreateDeployment />
        }
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}