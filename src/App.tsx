import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Automadeasy } from "./pages/Automadeasy";
import { NavBar } from "./pages/components/Navbar";
import { Editor } from "./pages/Editor";
import { Pages } from "./enums/Pages";
import { Help } from "./pages/Help";
import { Contact } from "./pages/Contact";
import { Footer } from "./pages/components/Footer";

function App() {
  return (
    <Router>
      <NavBar />

      <div className="allButFooter">
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
      </div>

      <Footer />
    </Router>
  );
}

export default App;
