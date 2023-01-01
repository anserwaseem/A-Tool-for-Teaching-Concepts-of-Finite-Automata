import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Automadeasy } from "./components/Automadeasy";
import { NavBar } from "./components/Navbar";
import { Editor } from "./components/Editor";
import { Pages } from "./enums/Pages";
import { Help } from "./components/Help";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path={process.env.PUBLIC_URL} element={<Automadeasy />} />
        <Route path={`${process.env.PUBLIC_URL}/${Pages.Editor}`} element={<Editor />} />
        <Route path={`${process.env.PUBLIC_URL}/${Pages.Help}`} element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
