import React, {Component} from 'react';
import SVGCanvas from "./SVG/SVGCanvas";
import SVGLineProp from "../Props/SVGLineProp";
import NodeTemplate from "./Nodes/NodeTemplate";
import Button from 'react-bootstrap/Button';
import NodeProps from "../Props/NodeProps";
import Filter from "./Nodes/Filter";
import Dropdown from "react-bootstrap/Dropdown";
import Source_CSV_Node from "./Nodes/SourceCSV";
import NodeCanvasProp from "../Props/NodeCanvasProp";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container'
import * as Icon from "react-feather";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Aggregation from "./Nodes/Aggregation";
import Subtract from "./Nodes/Subtract";
import TableNode from "./Nodes/TableNode";

interface IState {
    selectedAnchors: any[],
    lines: SVGLineProp[],
    nodes: JSX.Element[],
    mouseX: number,
    mouseY: number,
    mouseMoved: boolean,
    currentLine: SVGLineProp | null,
    canExecute: boolean,
    executeVariant: string
}

function NodeButton(props: any) {
    return <Button style={{marginBottom: "10px"}} variant={props.class}
                   onClick={props.onClick.bind(null, props.type)}>{props.icon} {props.name}</Button>;
}

class NodeCanvas extends Component<NodeCanvasProp, IState> {
    private ref: any;
    private websocket: any;

    constructor(props: NodeCanvasProp) {
        super(props);
        let tmp: JSX.Element[] = props.nodes.map(node => {
            node.anchorClickCallback = this.handleAnchorClick;
            return <NodeTemplate {...node}></NodeTemplate>;
        });

        this.ref = React.createRef();

        this.state = {
            selectedAnchors: [],
            lines: [],
            nodes: tmp,
            mouseX: 0,
            mouseY: 0,
            mouseMoved: false,
            currentLine: null,
            canExecute: false,
            executeVariant: "secondary"
        }
    }

    componentDidMount() {
        this.websocket = new WebSocket("ws://192.168.0.112:8765/", []);

        this.websocket.onerror = (e: any) => {
            this.setState({
                executeVariant: "danger",
                canExecute: false
            });
        }

        this.websocket.onmessage = (e: any) => {
            console.log(JSON.parse(e["data"]));
        };

        this.websocket.onopen = (e: any) => {
            this.setState({
                executeVariant: "success",
                canExecute: true
            });
        }
    }

    runCode = () => {
        this.websocket.send(JSON.stringify({action: "query", tree: {}}));
    }

    handleAnchorClick = (anchor: any, e: any) => {
        let anchors = this.state.selectedAnchors;
        anchors.push(anchor);

        let tmp: any[] = this.state.lines.map(line => line);
        let line = this.state.currentLine;

        if(anchors.length === 1) {

            let anchorBounds = e.getBoundingClientRect();
            let canvasBounds = this.ref.current.getBoundingClientRect();

            line = {
                x1: anchorBounds.left - canvasBounds.left + 10,
                y1: anchorBounds.top - canvasBounds.top + 10,
                x2: this.state.mouseX,
                y2: this.state.mouseY
            };

            tmp.push(line);
        }else if(anchors.length === 2){

            let anchorBounds = e.getBoundingClientRect();
            let canvasBounds = this.ref.current.getBoundingClientRect();

            anchors = [];
            if(line != null) {
                line.x2 = anchorBounds.left - canvasBounds.left + 10;
                line.y2 = anchorBounds.top - canvasBounds.top + 10;
            }
        }

        this.setState({
            selectedAnchors: anchors,
            lines: tmp,
            nodes: this.state.nodes,
            mouseX: this.state.mouseX,
            mouseY: this.state.mouseY,
            mouseMoved: false,
            currentLine: line
        });

    }

    addNode = (type: string) => {
        let tmp: any[] = this.state.nodes.map(node => node);
        let node: NodeProps;
        switch (type) {
            case "Filter":
                node = new Filter(0, 0);
                break;
            case "Substract":
                node = new Subtract(0, 0);
                break;
            case "Source_CSV_Node":
                node = new Source_CSV_Node(0, 0);
                break;
            case "Aggr":
                node = new Aggregation(0, 0);
                break;
            case "Table":
                node = new TableNode(0, 0);
                break;
            default:
                node = new Filter(0, 0);
        }
        node.anchorClickCallback = this.handleAnchorClick;
        tmp.push(<NodeTemplate {...node}></NodeTemplate>);
        this.setState({
            selectedAnchors: this.state.selectedAnchors,
            lines: this.state.lines,
            nodes: tmp,
            mouseX: this.state.mouseX,
            mouseY: this.state.mouseY,
            mouseMoved: false,
            currentLine: this.state.currentLine
        });
    }

    _onMouseMove = (e: any) => {

        let bounds = this.ref.current.getBoundingClientRect();
        let x = e.pageX - bounds.left;
        let y = e.pageY - bounds.top;

        let line = this.state.currentLine;

        let tmp: any[] = this.state.lines.map(line => line);
        if (this.state.selectedAnchors.length === 1 && this.state.currentLine != null) {
            // @ts-ignore
            line.x2 = x;
            // @ts-ignore
            line.y2 = y;
        }

        this.setState({
            selectedAnchors: this.state.selectedAnchors,
            lines: tmp,
            nodes: this.state.nodes,
            mouseX: x,
            mouseY: y,
            mouseMoved: true,
            currentLine: line
        });

    }

    render() {
        return (
            <>
                <div
                    className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                    <h5 className="my-0 mr-md-auto font-weight-normal">VisualSpark</h5>
                    <nav className="my-2 my-md-0 mr-md-3">
                        <a className="p-2" href="#">Explorar consultas</a>
                    </nav>
                </div>
                <Container>
                    <Row>
                        <Col xs={2}>
                            <Row>
                                <Col>
                                    <ButtonGroup aria-label="Basic example">
                                        <Button disabled={!this.state.canExecute} onClick={this.runCode} variant={this.state.executeVariant}><Icon.Play></Icon.Play> Ejecutar</Button>
                                        <DropdownButton as={ButtonGroup} title={<Icon.Save></Icon.Save>}
                                                        id="bg-nested-dropdown">
                                            <Dropdown.Item eventKey="1">Guardar</Dropdown.Item>
                                            <Dropdown.Item eventKey="2">Guardar Como</Dropdown.Item>
                                        </DropdownButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row style={{marginTop: "20px"}}>
                                <Col>
                                    <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Fuentes
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <NodeButton onClick={this.addNode} type={"Source_CSV_Node"}
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
                                                    <NodeButton onClick={this.addNode} type={"Filter"} class={"filter"}
                                                                name={"Filtro"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Limit"} class={"filter"}
                                                                name={"Límite"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Distinct"} class={"filter"}
                                                                name={"Distintos"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Subtract"} class={"filter"}
                                                                name={"Substraer"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Intersect"} class={"filter"}
                                                                name={"Intersección"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Union"} class={"filter"}
                                                                name={"Unión"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"OrderBy"} class={"filter"}
                                                                name={"Ordenar Por"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Sample"} class={"filter"}
                                                                name={"Muestra"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Select"} class={"filter"}
                                                                name={"Proyección"}
                                                                icon={<Icon.Filter></Icon.Filter>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Sort"} class={"filter"}
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
                                                    <NodeButton onClick={this.addNode} type={"Aggr"} class={"aggr"}
                                                                name={"Agregación"}
                                                                icon={<Icon.Box></Icon.Box>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Sum"} class={"aggr"}
                                                                name={"Suma"}
                                                                icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Min"} class={"aggr"}
                                                                name={"Mínimo"}
                                                                icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Max"} class={"aggr"}
                                                                name={"Máximo"}
                                                                icon={<Icon.Plus></Icon.Plus>}></NodeButton>

                                                    <NodeButton onClick={this.addNode} type={"Avg"} class={"aggr"}
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
                                                    <NodeButton onClick={this.addNode} type={"BarGraph"} class={"output"}
                                                                name={"Gráfico de barras"}
                                                                icon={<Icon.BarChart2></Icon.BarChart2>}></NodeButton>
                                                    <NodeButton onClick={this.addNode} type={"Table"} class={"output"}
                                                                name={"Tabla"}
                                                                icon={<Icon.BarChart2></Icon.BarChart2>}></NodeButton>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <div ref={this.ref} onMouseMove={this._onMouseMove} >
                                {this.state.nodes}
                                <SVGCanvas lines={this.state.lines}></SVGCanvas>
                            </div>
                        </Col>
                        <Col xs={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Sin salidas</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Introduce salidas</Card.Subtitle>
                                    <Card.Text>
                                        Para ver resultados en este panel introduce salidas en el diseñador.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default NodeCanvas;