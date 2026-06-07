import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-[#f4f4f5] flex flex-col items-center justify-center gap-3 font-sans">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Checking authentication status...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}
