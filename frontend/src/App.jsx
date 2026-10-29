
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DisputeProvider } from "./context/DisputeContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AllDisputes = lazy(() => import("./pages/AllDisputes"));
const NewDispute = lazy(() => import("./pages/NewDispute"));

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role?.toUpperCase())
  ) {
    return (
      <Navigate
        to={user?.role?.toUpperCase() === "ADMIN"
          ? "/admin/dashboard"
          : "/customer/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return children;

  return (
    <Navigate
      to={user?.role?.toUpperCase() === "ADMIN"
        ? "/admin/dashboard"
        : "/customer/dashboard"}
      replace
    />
  );
}

function PortalLayout() {
  return <MainLayout />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="page">Loading page...</div>}>
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />

        <Route
          path="/register"
          element={<PublicRoute><Register /></PublicRoute>}
        />

        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route element={<PortalLayout />}>
            <Route
              path="/customer/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/customer/disputes"
              element={<AllDisputes />}
            />
            <Route
              path="/customer/new-dispute"
              element={<NewDispute />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<PortalLayout />}>
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/admin/disputes"
              element={<AllDisputes />}
            />
            <Route
              path="/admin/analytics"
              element={<Analytics />}
            />
          </Route>
        </Route>

        <Route
          path="/dashboard"
          element={<RoleHomeRedirect />}
        />
        <Route
          path="/"
          element={<RoleHomeRedirect />}
        />
        <Route
          path="*"
          element={<RoleHomeRedirect />}
        />
      </Routes>
    </Suspense>
  );
}

function RoleHomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user?.role?.toUpperCase() === "ADMIN"
        ? "/admin/dashboard"
        : "/customer/dashboard"}
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DisputeProvider>
          <AppRoutes />
        </DisputeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
