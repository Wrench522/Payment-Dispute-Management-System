
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { DisputeProvider } from "./context/DisputeContext";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AllDisputes from "./pages/AllDisputes";
import NewDispute from "./pages/NewDispute";

export default function App() {
  return (
    <DisputeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/disputes" element={<AllDisputes />} />
            <Route path="/new-dispute" element={<NewDispute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DisputeProvider>
  );
}
