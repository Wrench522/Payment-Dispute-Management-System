
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <div>
            <h2>PayResolve</h2>
            <p>
              Welcome, {user?.fullName || user?.email || "User"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </header>

        <Outlet />

        <footer>
          PayResolve · Payment Dispute Management System
        </footer>
      </main>
    </div>
  );
}
