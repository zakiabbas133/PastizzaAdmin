import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
