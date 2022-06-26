import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import NavBar from "./NavBar";
import AddDeleteTableRows from "./add_delete_table/addDeleteTableRows";

const EditTransitionTable = () => {
  return (
    <>
      <NavBar pageName="Editor (Transition Table)" />
      <Container fluid className="py-5 ps-5">
        <Row>
          <AddDeleteTableRows />
        </Row>
      </Container>
    </>
  );
};

export default EditTransitionTable;
