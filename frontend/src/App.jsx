
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { DisputeProvider } from "./context/DisputeContext";
import MainLayout from "./layouts/MainLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AllDisputes = lazy(() => import("./pages/AllDisputes"));
const NewDispute = lazy(() => import("./pages/NewDispute"));

export default function App() {
  return (
    <DisputeProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="page">Loading page...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/disputes" element={<AllDisputes />} />
              <Route path="/new-dispute" element={<NewDispute />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DisputeProvider>
  );
}
