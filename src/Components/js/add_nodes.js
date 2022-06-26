import React, { useState } from "react";
// import { Container } from "react-bootstrap";
import styled from "styled-components";
import "../css/AddNodes.css";

export default function AddNodes(props) {
  const [circles, setCircles] = useState([]);

  const getClickCoords = (event) => {
    // from: https://stackoverflow.com/a/29296049/14198287
    var e = event.target;
    var dim = e.getBoundingClientRect();
    var x = event.clientX - dim.left;
    var y = event.clientY - dim.top;
    return [x, y];
  };

  const addCircle = (event) => {
    // get click coordinates
    let [x, y] = getClickCoords(event);

    // make new svg circle element
    // more info here: https://www.w3schools.com/graphics/svg_circle.asp
    let newCircle = (
      <circle
        key={circles.length + 1}
        cx={x}
        cy={y}
        r="20"
        stroke="black"
        strokeWidth="1"
        fill="white"
        textAnchor="abc"
      />
    );

    // update the array of circles; you HAVE to spread the current array
    // as 'circles' is immutible and will not accept new info
    let allCircles = [...circles, newCircle];

    // update 'circles'
    setCircles(allCircles);
  };

  console.log(circles);

  return (
    <div
      style={{
        minHeight: "120px",
        height: "38%",
      }}
    >
      {props?.editTable ? (
        <ClickableSVG onClick={addCircle}>
          {/* This loads your circles in the circles hook here */}
          {circles}
        </ClickableSVG>
      ) : (
        <ClickableSVG></ClickableSVG>
      )}
    </div>
  );
}

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

const ClickableSVG = styled.svg`
  width: 100%;
  height: 500%;
  background-image: url("https://img.freepik.com/free-photo/light-gray-background-with-small-sparkles-texture-macro-focus-microtexture_328295-112.jpg");
  background-size: 100%;
  background-repeat: no-repeat;

  & * {
    pointer-events: none;
  }
`;
