import React from "react";
import About from "./About";
import NavBar from "./NavBar";
import Editors from "./Editors";
import Functionalities from "./Functionalities";
import App from "./Home.js";
import EditTransitionTable from "./EditTransitionTable.js"
import "../css/A3S.css";

import "../css/A3S.css";

const A3S = () => {
  return (
    <>
      <NavBar />
      <About />
      <Editors />
      <Functionalities />
      {/* <App /> */}
    </>
  );
};
export default A3S;
