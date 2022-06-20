import React from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import "../css/A3S.css";
import "../css/Functionalities.css";

const Functionalities = () => {
  return (
    <Container fluid className="py-5 light-bg">
      <Row>
        <Col sm={12} md={5} lg={4}>
          <h3 className="mx-5 mb-5">What we provide?</h3>
        </Col>
        <Col>
          <Stack gap={5}>
            <Button size="lg" variant="outline-info" className="dark-bg">Test String on DFA/NFA</Button>
            <Button size="lg" variant="outline-info" className="light-bg">Minimize DFA</Button>
            <Button size="lg" variant="outline-info" className="dark-bg">Convert NFA to DFA</Button>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};
export default Functionalities;
