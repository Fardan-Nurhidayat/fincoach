// components/ConditionalRoute.jsx
import { Navigate, useLocation } from "react-router";
import { isMaintenance } from "@/utils/config";

const ConditionalRoute = ({ children }) => {
  const location = useLocation();

  // Izinkan akses ke halaman utama (/) dan /maintenance
  const allowedPaths = ["/", "/maintenance"];

  if (isMaintenance && !allowedPaths.includes(location.pathname)) {
    localStorage.removeItem("fincoach_token");
    return (
      <Navigate
        to='/maintenance'
        replace
      />
    );
  }

  return children;
};

export default ConditionalRoute;
