import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav className="navbar container">
        <div className="logo">
          <span>🦊</span>
          Interfox
        </div>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/dream-home" className={({ isActive }) => isActive ? "active" : ""}>
            Dream Home
          </NavLink>
          <NavLink to="/finances" className={({ isActive }) => isActive ? "active" : ""}>
            Finances
          </NavLink>
          <NavLink to="/planner" className={({ isActive }) => isActive ? "active" : ""}>
            Planner
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
