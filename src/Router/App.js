import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import A3S from "../Components/js/A3S";
import EditTransitionTable from "../Components/js/EditTransitionTable";
import EditStates from "../Components/js/EditStates";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<A3S />}></Route>
        <Route
          path="/EditTransitionTable"
          element={<EditTransitionTable />}
        ></Route>
        <Route path="/EditStates" element={<EditStates />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
