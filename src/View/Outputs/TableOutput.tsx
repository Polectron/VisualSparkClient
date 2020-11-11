import React from "react";
import Card from "react-bootstrap/Card";

class TableOutput extends React.Component<any, any> {
    render() {
        return (
            <Card style={{marginTop: "10px"}}>
                <Card.Body>
                    <Card.Title>Table Output {this.props.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Test Output</Card.Subtitle>
                    <Card.Text>
                        This is just a test.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default TableOutput;