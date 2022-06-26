import React from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import "../css/Functionalities.css";

const Functionalities = () => {
  return (
    <Container fluid className="py-5 light-bg">
      <Row>
        <Col sm={12} md={5} lg={4}>
          <h3 className="mx-5 mb-5">What we provide?</h3>
        </Col>
        <Col sm md={5} lg={6}>
          <Stack gap={5} className="px-5">
            <Button size="lg" variant="outline-dark" className="dark-bg">
              Test String on DFA/NFA
            </Button>
            <Button size="lg" variant="outline-dark" className="dark-bg">
              Minimize DFA
            </Button>
            <Button size="lg" variant="outline-dark" className="dark-bg">
              Convert NFA to DFA
            </Button>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};
export default Functionalities;
