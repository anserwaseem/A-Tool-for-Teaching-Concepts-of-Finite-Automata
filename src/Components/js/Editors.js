import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../css/A3S.css";
import "../css/Editors.css";

const Editors = () => {
  return (
    <Container fluid className="py-5 dark-bg">
      <Row>
        <Col sm={12} md={2} lg={2}>
          <h3 className="mx-5 mb-5">Editors</h3>
        </Col>
        <Col sm={12} md={5} lg>
          <Card className="mb-5 light-bg editor-card">
            <Card.Img
              className="editor-card-img"
              variant="top"
              src={require("../images/img-editor-states-and-transitions.png")}
            />
            <Card.Body>
              <Card.Text>Create Using States and Transitions</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <br />
        <Col sm={12} md={5} lg>
          <Card className="light-bg editor-card">
            <Card.Img
              className="editor-card-img"
              variant="top"
              src={require("../images/img-editor-transition-table.png")}
            />
            <Card.Body className="pb-0">
              <Card.Text className="pb-2">
                Create Using Transition Table
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Editors;
