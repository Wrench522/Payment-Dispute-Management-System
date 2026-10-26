
import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "▦" },
  { path: "/analytics", label: "Analytics", icon: "◔" },
  { path: "/disputes", label: "All disputes", icon: "▤" },
  { path: "/new-dispute", label: "New dispute", icon: "+" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">PD</div>
        <div>
          <h2>PayResolve</h2>
          <span>Dispute Management</span>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
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
