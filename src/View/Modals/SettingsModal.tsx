import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class SettingsModal extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { sparkServer: props.sparkServer, sparkLimit: props.sparkLimit };
    }

    onSave = (e: any) => {
        e.preventDefault();
        this.props.onSave(this.state);
        this.props.onHide();
    }

    onChange = (e: any) => {
        this.setState({ sparkServer: e.target.value });
    };

    onChangeLimit = (e: any) => {
        this.setState({ sparkLimit: e.target.value });
    };

    render() {
        return (
            <Modal
                {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <form onSubmit={this.onSave}>
        <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Configuración
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        Servidor Spark: <input type="text" value={this.state.sparkServer} onChange={this.onChange} />
        </Col>
        </Row>
        <Row>
        <Col>
            Límite consulta: <input type="number" value={this.state.sparkLimit} onChange={this.onChangeLimit} />
        </Col>
        </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" type="submit">Guardar</Button> <Button variant={"secondary"}
        onClick={this.props.onHide}>Cancelar</Button>
            </Modal.Footer>
            </form>
            </Modal>
    );
    }
}

export default SettingsModal;