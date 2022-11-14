import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { A3S } from "./components/A3S";
import { NavBar } from "./components/Navbar";
import { Editor } from "./components/Editor";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path={process.env.PUBLIC_URL} element={<A3S />} />
        <Route path={`${process.env.PUBLIC_URL}/Editor`} element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
