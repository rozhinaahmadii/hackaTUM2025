import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import DreamHome from "./pages/DreamHome";
import Finances from "./pages/Finances";
import Planner from "./pages/Planner";

export default function App() {
  return (
    <>
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dream-home" element={<DreamHome />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </div>

      <Footer /> {/* ← ADD THIS */}
    </>
  );
}
