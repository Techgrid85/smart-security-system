import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "resident") {
      return <Navigate to="/resident" replace />;
    }

    if (user.role === "guard") {
      return <Navigate to="/guard" replace />;
    }

    if (user.role === "staff") {
      return <Navigate to="/staff" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;