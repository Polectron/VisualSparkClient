import React, {Component} from 'react';
import SVGCanvas from "./SVG/SVGCanvas";
import SVGLineProp from "../Props/SVGLineProp";
import NodeTemplate from "./Nodes/NodeTemplate";
import Button from 'react-bootstrap/Button';
import NodeProp from "../Props/NodeProp";
import Dropdown from "react-bootstrap/Dropdown";
import NodeCanvasProp from "../Props/NodeCanvasProp";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container'
import * as Icon from "react-feather";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SettingsModal from "./Modals/SettingsModal";
import QueriesModal from "./Modals/QueriesModal";
import NodesSwatch from "./NodesSwatch";
import TableOutput from "./Outputs/TableOutput";

interface NodeCanvasState {
    selectedAnchors: any[],
    lines: SVGLineProp[],
    nodes: NodeTemplate[],
    outputs: any[],
    mouseX: number,
    mouseY: number,
    mouseMoved: boolean,
    currentLine: SVGLineProp | null,
    canExecute: boolean,
    executeVariant: string,
    modalShow: boolean,
    modalQueriesShow: boolean,
    sparkServer: string,
    sparkLimit: number,
    savedQueries: string[],
    expandedOutputs: any,
    outputsIcon: any
}

class NodeCanvas extends Component<NodeCanvasProp, NodeCanvasState> {
    private ref: any;
    private websocket: any;
    private nodeRefs: any[];

    constructor(props: NodeCanvasProp) {
        super(props);

        this.ref = React.createRef();
        this.nodeRefs = [];

        let tmp: any[] = props.nodes.map((node) => {
            return this.createNode(node);
        });

        let sparkServer = localStorage.getItem("sparkServer");
        if (sparkServer === null) {
            sparkServer = ""
        }
        let sparkLimit = Number(localStorage.getItem("sparkLimit"));
        if (sparkLimit === null) {
            sparkLimit = 1000
        }
        let savedQueriesjson = localStorage.getItem("savedQueries");
        if (savedQueriesjson === null) {
            savedQueriesjson = '[{"name":"Example 1", "img": "No-image-available.png", "tree": {}},' +
                ' {"name":"Example 2", "img":"No-image-available.png", "tree": {}},' +
                ' {"name":"Example 3", "img": "No-image-available.png", "tree": {}},' +
                ' {"name":"Example 1", "img": "No-image-available.png", "tree": {}},' +
                ' {"name":"Example 2", "img": "No-image-available.png", "tree": {}}]'
        }
        let savedQueries = JSON.parse(savedQueriesjson);

        this.websocket = null;

        this.state = {
            selectedAnchors: [],
            lines: [],
            nodes: tmp,
            outputs: [],
            mouseX: 0,
            mouseY: 0,
            mouseMoved: false,
            currentLine: null,
            canExecute: false,
            executeVariant: "secondary",
            modalShow: false,
            modalQueriesShow: false,
            sparkServer: sparkServer,
            sparkLimit: sparkLimit,
            savedQueries: savedQueries,
            expandedOutputs: "d-lg-block",
            outputsIcon: <Icon.ArrowLeft/>
        }

    }

    componentDidMount = () => {
        this.connectWebSocket();
    }

    connectWebSocket = () => {
        if (this.state.sparkServer === "") {
            return 0;
        }

        if (this.websocket !== null) {
            this.websocket.close();
        }

        this.websocket = new WebSocket(`ws://${this.state.sparkServer}`, []);

        this.websocket.onerror = (e: any) => {
            this.setState({
                executeVariant: "danger",
                canExecute: false
            });
            console.error(e);
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

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.sparkServer !== this.state.sparkServer) {
            console.log(this.state.sparkServer);
            this.connectWebSocket();
        }
    }

    onSettingsSave = (data: any) => {
        this.setState({canExecute: false, executeVariant: "secondary", ...data});
        localStorage.setItem("sparkLimit", data.sparkLimit);
        localStorage.setItem("sparkServer", data.sparkServer);
    }

    runCode = () => {
        this.websocket.send(JSON.stringify({action: "query", tree: {}, limit: this.state.sparkLimit}));
    }

    handleAnchorClick = (anchor: any, e: any) => {
        let anchors = this.state.selectedAnchors;
        anchors.push(anchor);

        let tmp: any[] = this.state.lines.map(line => line);
        let line = this.state.currentLine;

        if (anchors.length === 1) {

            let anchorBounds = e.getBoundingClientRect();
            let canvasBounds = this.ref.current.getBoundingClientRect();

            line = {
                x1: anchorBounds.left - canvasBounds.left + 10,
                y1: anchorBounds.top - canvasBounds.top + 10,
                x2: this.state.mouseX,
                y2: this.state.mouseY,
                anchorOne: anchor,
                anchorTwo: null
            };

            tmp.push(line);
        } else if (anchors.length === 2) {

            let anchorBounds = e.getBoundingClientRect();
            let canvasBounds = this.ref.current.getBoundingClientRect();

            if (line != null) {
                line.x2 = anchorBounds.left - canvasBounds.left + 10;
                line.y2 = anchorBounds.top - canvasBounds.top + 10;

                anchors.forEach((a) => {
                    let node_index = a.parent.props.index;
                    let anchor = this.nodeRefs[node_index].current.getAnchorRef(a.index).current;
                    anchor.addLine(line);
                });

                line.anchorOne = anchors[0];
                line.anchorTwo = anchors[1];

            }

            line = null;
            anchors = [];
        }

        this.setState({
            selectedAnchors: anchors,
            lines: tmp,
            mouseMoved: false,
            currentLine: line
        });

    }

    addNode = (data: any) => {
        let tmp: any[] = this.state.nodes.map(node => node);
        let node: NodeProp = data.node;
        let onAdd: any = data.onAdd;

        if(node !== null) {
            tmp.push(this.createNode(node));
            this.setState({
                nodes: tmp,
                mouseMoved: false,
            });
        }

        if(onAdd !== null){
            onAdd(this.nodeRefs.length - 1);
        }

    }

    private createNode(node: NodeProp) {
        node.anchorClickCallback = this.handleAnchorClick;
        this.nodeRefs.push(React.createRef());
        let id = this.nodeRefs.length - 1;
        return <NodeTemplate {...node} ref={this.nodeRefs[id]} key={"node_" + id} index={id} canvas={this.ref}/>;
    }

    private addOutput = (id: number) => {
        console.log("Adding output for node "+id);
        let tmp: any[] = this.state.outputs.map(o => o);

        tmp.push(<TableOutput id={id}/>);

        console.log(tmp);

        this.setState({outputs: tmp});
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
            lines: tmp,
            mouseX: x,
            mouseY: y,
            mouseMoved: true,
            currentLine: line
        });

    }

    saveQuery = () => {
        console.log("Saving query");

        this.nodeRefs.forEach((nr) => {
            let n = nr.current;
            console.log(n);
            n.anchorRefs.forEach((ar: any) => {
                let a = ar.current;
                console.log(a);
            });

            n.controlRefs.forEach((cr: any) => {
                let c = cr.current;
                console.log(c);
                console.log(c.getValue());
            });
        });
    }

    breakSVGLine = () => {
        let tmpLines = this.state.lines;
        if (this.state.currentLine) {
            tmpLines = tmpLines.filter(x => x !== this.state.currentLine);
        }
        this.setState({currentLine: null, lines: tmpLines, selectedAnchors: []})
    }

    renderOutputs = () => {
        if (this.state.outputs.length <= 0) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>Sin salidas</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Introduce salidas</Card.Subtitle>
                        <Card.Text>
                            Para ver resultados en este panel introduce salidas en la consulta.
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        } else {
            return (
                this.state.outputs
            );
        }
    }

    render() {
        return (
            <>
                <div
                    className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                    <h5 className="my-0 mr-md-auto font-weight-normal">VisualSpark</h5>
                    <nav className="my-2 my-md-0 mr-md-3">
                        <Button className="p-2" onClick={() => this.setState({modalQueriesShow: true})}>Explorar
                            consultas</Button>
                    </nav>
                </div>
                <Container>
                    <Row>
                        <Col style={{marginBottom: "15px"}}>
                            <ButtonGroup aria-label="Basic example">
                                <OverlayTrigger
                                    key={"run"}
                                    placement={"top"}
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                            {this.state.sparkServer}
                                        </Tooltip>
                                    }
                                >
                                    <Button disabled={!this.state.canExecute} onClick={this.runCode}
                                            variant={this.state.executeVariant}><Icon.Play/></Button>
                                </OverlayTrigger>
                                <DropdownButton className="d-none d-lg-block" as={ButtonGroup}
                                                title={<Icon.Save/>}
                                                id="bg-nested-dropdown">
                                    <Dropdown.Item eventKey="1" onClick={this.saveQuery}>Guardar</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">Guardar Como</Dropdown.Item>
                                </DropdownButton>
                                <Button onClick={() => this.setState({modalShow: true})}
                                        variant={"secondary"}><Icon.Settings/></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={"d-none "+this.state.expandedOutputs} lg={2}>
                            <Row>
                                <Col>
                                    <NodesSwatch addNode={this.addNode} addOutput={this.addOutput}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col className={"d-none "+this.state.expandedOutputs} lg={7}>
                            <div ref={this.ref} onMouseMove={this._onMouseMove}>
                                {this.state.nodes}
                                <SVGCanvas lines={this.state.lines} breakSVGLine={this.breakSVGLine}/>
                            </div>
                        </Col>
                        <Col>
                            <Button className={"d-none d-lg-block"} onClick={this.toggleOutputs}>{this.state.outputsIcon}</Button>
                            {this.renderOutputs()}
                        </Col>
                    </Row>
                </Container>
                <SettingsModal
                    sparkLimit={this.state.sparkLimit}
                    sparkServer={this.state.sparkServer}
                    show={this.state.modalShow}
                    onHide={() => this.setState({modalShow: false})}
                    onSave={this.onSettingsSave}
                />
                <QueriesModal
                    savedQueries={this.state.savedQueries}
                    show={this.state.modalQueriesShow}
                    onHide={() => this.setState({modalQueriesShow: false})}
                />
            </>
        );
    }

    private toggleOutputs = () => {
        if(this.state.expandedOutputs === ""){
            this.setState({expandedOutputs: "d-lg-block", outputsIcon: <Icon.ArrowLeft/>});
        }else{
            this.setState({expandedOutputs: "", outputsIcon: <Icon.ArrowRight/>});
        }
    }
}

export default NodeCanvas;