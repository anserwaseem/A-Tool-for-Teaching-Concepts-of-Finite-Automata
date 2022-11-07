import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import A3S from "./components/A3S";
import { Pages } from "./enums/pages";
import Editor from "./components/Editor";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/A-Tool-for-Teaching-Concepts-of-Finite-Automata/a3s"
          element={<A3S />}
        />
        <Route
          path="/A-Tool-for-Teaching-Concepts-of-Finite-Automata"
          element={<Editor />}
        />
      </Routes>
    </Router>
  );
}

export default App;
