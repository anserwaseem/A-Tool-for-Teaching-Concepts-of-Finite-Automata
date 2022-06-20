import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../css/A3S.css";
import "../css/About.css";

const About = () => {
  return (
    <Container fluid className="py-5 light-bg">
      <Row>
        <Col sm={12} md={2} lg={2}>
          <h3 className="mx-5 mb-5">About</h3>
        </Col>
        <Col>
          <Container id="about-text" className="dark-bg py-5">
            <blockquote>
              <h4 className="px-5">
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; A3S provides a
                simulated environment where you will be able to make DFAs
                (Deterministic Finite Automata), NFAs (Non-Deterministic Finite
                Automata), and see their working through animations. Here you
                will be able to learn DFA minimization, NFA to DFA conversion
                and much more. A3S will give you an experience like no one. We
                promise to enhance your automata skills while making your
                journey exciting.
                <br />
                <br />
              </h4>
            </blockquote>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};
export default About;
