import React from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TableRows from "./TableRows";
import AddNodes from "../add_nodes";

function AddDeleteTableRows(props) {
  const [rowsData, setRowsData] = useState([]);

  const addTableRows = () => {
    const rowsInput = {
      node: "",
      a: "",
      b: "",
    };
    setRowsData([...rowsData, rowsInput]);
  };
  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
    console.log(value);
    addCircle(value);
  };

  const boxStyle = {
    padding: "10px",
    border: "1px solid black",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
  };

  const addCircle = (value) => {
    console.log(value);
    <div style={boxStyle}>{value}</div>;
  };

  return (
    <>
      <Col sm={{ span: 12, order: props.order }} md={3} lg={3}>
        <h3>Transition Table</h3>
        <table
          className="table"
          responsive="sm"
          striped
          bordered
          hover
          style={{ width: "80%" }}
        >
          <thead>
            <tr>
              <th>Node</th>
              <th>a</th>
              <th>b</th>
              <th>
                <button
                  className="btn btn-outline-success"
                  onClick={addTableRows}
                  {...(props?.disableTable && { disabled: true })}
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <TableRows
              rowsData={rowsData}
              deleteTableRows={deleteTableRows}
              handleChange={handleChange}
            />
          </tbody>
        </table>
      </Col>

      <Col sm={12} md={8} lg={8}>
        <AddNodes editTable={props?.editTable}/>
        {/* <TransformWrapper
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
                <AddNodes />
               
                <img
                  src={require("../../images/img-editor-states-and-transitions.png")}
                ></img>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper> */}

        {/* <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "600px",
            backgroundColor: "lightgray",
          }}
        >
          <addCircle />
        </div> */}
      </Col>
    </>
  );
}
export default AddDeleteTableRows;
