import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Automadeasy } from "./pages/Automadeasy";
import { NavBar } from "./pages/components/Navbar";
import { Editor } from "./pages/Editor";
import { Pages } from "./enums/Pages";
import { Help } from "./pages/Help";
import { Contact } from "./pages/Contact";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path={process.env.PUBLIC_URL} element={<Automadeasy />} />
        <Route
          path={`${process.env.PUBLIC_URL}/${Pages.Editor}`}
          element={<Editor />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/${Pages.Help}`}
          element={<Help />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/${Pages.Contact}`}
          element={<Contact />}
        />
      </Routes>
    </Router>
  );
}

export default App;
