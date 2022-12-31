import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Automadeasy } from "./components/Automadeasy";
import { NavBar } from "./components/Navbar";
import { Editor } from "./components/Editor";
import { Pages } from "./enums/Pages";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path={process.env.PUBLIC_URL} element={<Automadeasy />} />
        <Route path={`${process.env.PUBLIC_URL}/${Pages.Editor}`} element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
