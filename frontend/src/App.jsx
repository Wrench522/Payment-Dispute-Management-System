
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

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DisputeProvider>
          <Suspense fallback={<div className="page">Loading page...</div>}>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route
                    path="/dashboard"
                    element={<Dashboard />}
                  />
                  <Route
                    path="/analytics"
                    element={<Analytics />}
                  />
                  <Route
                    path="/disputes"
                    element={<AllDisputes />}
                  />
                  <Route
                    path="/new-dispute"
                    element={<NewDispute />}
                  />
                </Route>
              </Route>

              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          </Suspense>
        </DisputeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
