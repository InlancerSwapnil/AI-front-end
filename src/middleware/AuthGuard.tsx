import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

interface AuthState {
  auth: {
    jwtToken: string | null;
    expired_at: number | null;
  };
}

export const AuthGuard = () => {
  const token = useSelector((state: AuthState) => state.auth.jwtToken);
  const expired = useSelector((state: AuthState) => state.auth.expired_at);

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = expired && expired < currentTime;

  const auth = token && !isExpired;

  return auth ? <Outlet /> : <Navigate to="/auth" />;
};
