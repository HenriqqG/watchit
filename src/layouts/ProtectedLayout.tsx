import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/general-components/Loading";

export default function ProtectedLayout() {
  const { user, loading } = useAuthStore();
  const location = useLocation();
  
  if (loading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet key={location.pathname}/>;
}
