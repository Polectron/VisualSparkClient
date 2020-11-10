import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import * as Icon from "react-feather";
import React from "react";

function NodeButton(props: any) {
    return <Button style={{margin: "10px"}} variant={props.class}
                   onClick={props.onClick.bind(null, props.type)}>{props.icon} {props.name}</Button>;
}

class NodesSwatch extends React.Component<any, any> {

    render() {
        return (
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            Fuentes
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <NodeButton onClick={this.props.addNode} type={"Source_JDBC_Node"}
                                        class={"source"}
                                        name={"Fuente JDBC"}
                                        icon={
                                            <Icon.Database></Icon.Database>}></NodeButton>
                            <NodeButton onClick={this.props.addNode} type={"Source_MONGODB_Node"}
                                        class={"source"}
                                        name={"Fuente MongoDB"}
                                        icon={
                                            <Icon.Database></Icon.Database>}></NodeButton>
                            <NodeButton onClick={this.props.addNode} type={"Source_JSON_Node"}
                                        class={"source"}
                                        name={"Fuente JSON"}
                                        icon={
                                            <Icon.Database></Icon.Database>}></NodeButton>
                            <NodeButton onClick={this.props.addNode} type={"Source_CSV_Node"}
                                        class={"source"}
                                        name={"Fuente CSV"}
                                        icon={
                                            <Icon.Database></Icon.Database>}></NodeButton>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            Filtros
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <NodeButton onClick={this.props.addNode} type={"Filter"} class={"filter"}
                                        name={"Filtro"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Limit"} class={"filter"}
                                        name={"Límite"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Distinct"} class={"filter"}
                                        name={"Distintos"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Subtract"} class={"filter"}
                                        name={"Substraer"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Intersect"} class={"filter"}
                                        name={"Intersección"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Union"} class={"filter"}
                                        name={"Unión"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"OrderBy"} class={"filter"}
                                        name={"Ordenar Por"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Sample"} class={"filter"}
                                        name={"Muestra"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Select"} class={"filter"}
                                        name={"Proyección"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Sort"} class={"filter"}
                                        name={"Muestra"}
                                        icon={<Icon.Filter></Icon.Filter>}></NodeButton>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            Agregación
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <NodeButton onClick={this.props.addNode} type={"Aggr"} class={"aggr"}
                                        name={"Agregación"}
                                        icon={<Icon.Box></Icon.Box>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Sum"} class={"aggr"}
                                        name={"Suma"}
                                        icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Min"} class={"aggr"}
                                        name={"Mínimo"}
                                        icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Max"} class={"aggr"}
                                        name={"Máximo"}
                                        icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                            <NodeButton onClick={this.props.addNode} type={"Avg"} class={"aggr"}
                                        name={"Media"}
                                        icon={<Icon.Plus></Icon.Plus>}></NodeButton>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            Salidas
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            <NodeButton onClick={this.props.addNode} type={"BarGraph"} class={"output"}
                                        name={"Gráfico de barras"}
                                        icon={<Icon.BarChart2></Icon.BarChart2>}></NodeButton>
                            <NodeButton onClick={this.props.addNode} type={"Table"} class={"output"}
                                        name={"Tabla"}
                                        icon={<Icon.BarChart2></Icon.BarChart2>}></NodeButton>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

export default NodesSwatch;