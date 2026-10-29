
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const menuItems = isAdmin
    ? [
        { path: "/admin/dashboard", label: "Dashboard", icon: "▦" },
        { path: "/admin/analytics", label: "Analytics", icon: "◔" },
        { path: "/admin/disputes", label: "All disputes", icon: "▤" },
      ]
    : [
        { path: "/customer/dashboard", label: "Dashboard", icon: "▦" },
        { path: "/customer/disputes", label: "My disputes", icon: "▤" },
        { path: "/customer/new-dispute", label: "Submit dispute", icon: "+" },
      ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">PD</div>
        <div>
          <h2>PayResolve</h2>
          <span>{isAdmin ? "Admin Portal" : "Customer Portal"}</span>
        </div>
      </div>

      <p className="nav-label">
        {isAdmin ? "ADMIN WORKSPACE" : "MY ACCOUNT"}
      </p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="status-dot" />
        Backend API
        <span className="connected">Connected*</span>
        <p className="sidebar-note">
          *Connection is confirmed when data loads successfully.
        </p>
      </div>
    </aside>
  );
}
