import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function QueryCard(props: any){
    return (
        <Col xs={4} style={{"marginBottom": "15px"}}>
            <Card>
                <Card.Header as="h5">{props.name}</Card.Header>
                <Card.Img variant="top" src={props.img} />
                <Card.Body>
                    <Row>
                        <Col>
                            <Button onClick={()=>{alert("Abriendo: "+JSON.stringify(props))}} variant="primary">Abrir</Button>
                        </Col>
                        <Col>
                            <Button onClick={()=>{alert("Eliminando: "+JSON.stringify(props))}} variant="danger">Eliminar</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

class QueriesModal extends React.Component<any, any> {

    renderQueries = () => {
        console.log(this.props.savedQueries);
        let queries = this.props.savedQueries.map(
            (x: any)=>{return (<QueryCard {...x}/>);}
        );
        return queries;
    }

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
                                {this.renderQueries()}
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