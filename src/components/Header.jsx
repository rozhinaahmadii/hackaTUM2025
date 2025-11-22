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
          <NavLink to="/planner" className={({ isActive }) => isActive ? "active" : ""}>
            Planner
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
            Profile
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
