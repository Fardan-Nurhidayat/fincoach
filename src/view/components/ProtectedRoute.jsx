import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("fincoach_token");

  if (!token) {
    // Jika token tidak ada, alihkan ke login
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
