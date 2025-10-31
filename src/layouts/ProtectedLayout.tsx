import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/general-components/Loading";

export default function ProtectedLayout() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
