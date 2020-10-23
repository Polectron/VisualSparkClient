import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class QueriesModal extends React.Component<any, any> {

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Consultas guardadas
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col>

                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer><Button variant={"secondary"}
                                          onClick={this.props.onHide}>Cancelar</Button>
                    </Modal.Footer>
            </Modal>
        );
    }
}

export default QueriesModal;