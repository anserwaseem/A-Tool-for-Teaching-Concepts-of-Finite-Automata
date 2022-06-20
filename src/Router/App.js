import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import A3S from "../Components/js/A3S";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<A3S />}></Route>
      </Routes>
    </Router>
  );
};

export default App;