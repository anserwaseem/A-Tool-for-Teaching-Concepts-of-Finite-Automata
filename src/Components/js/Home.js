import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import AddDeleteTableRows from "./add_delete_table/addDeleteTableRows";
import AddNodes from "./add_nodes";
import Archer from "./add_delete_table/archer";

function App() {
  return (
    <div className="App">
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <div className="tools">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
            </div>
            <TransformComponent>
              {/* <div
                style={{
                  width: "400px",
                  height: "400px",
                  backgroundColor: "blue",
                  borderColor: "yellow",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div> */}
              <img src={require("../images/img-editor-states-and-transitions.png")}></img>
              <div>Example text</div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      <AddDeleteTableRows />
      <AddNodes />
      <Archer />
    </div>
  );
}

export default App;
