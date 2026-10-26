
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Outlet />
        <footer>
          PayResolve · Payment Dispute Management System
        </footer>
      </main>
    </div>
  );
}
