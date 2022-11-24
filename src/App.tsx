import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Automadeasy } from "./components/Automadeasy";
import { NavBar } from "./components/Navbar";
import { Editor } from "./components/Editor";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path={process.env.PUBLIC_URL} element={<Automadeasy />} />
        <Route path={`${process.env.PUBLIC_URL}/Editor`} element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
