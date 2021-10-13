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
                            <Button onClick={()=>{props.openSavedQuery(props.id, props.closeModal)}} variant="primary">Abrir</Button>
                        </Col>
                        <Col>
                            <Button onClick={()=>{props.deleteSavedQuery(props.id)}} variant="danger">Eliminar</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

class QueriesModal extends React.Component<any, any> {

    renderQueries = () => {
        let queries = this.props.savedqueries.map(
            (query: any, id: number)=>{return (<QueryCard {...query} id={id} deleteSavedQuery={this.props.deleteSavedQuery} openSavedQuery={this.props.openSavedQuery} closeModal={this.props.onHide} key={"query_"+id}/>);}
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