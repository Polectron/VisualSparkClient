import React, {Component, useState, useEffect} from 'react';
import SVGCanvas from "./SVG/SVGCanvas";
import NodeTemplate from "./Nodes/NodeTemplate";
import Button from 'react-bootstrap/Button';
import NodeProp from "../Props/NodeProp";
import Dropdown from "react-bootstrap/Dropdown";
import NodeCanvasProp from "../Props/NodeCanvasProp";
import SVGLineProp from "../Props/SVGLineProp";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container'
import * as Icon from "react-feather";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SettingsModal from "./Modals/SettingsModal";
import QueriesModal from "./Modals/QueriesModal";
import NodesSwatch from "./NodesSwatch";
import NodeControl from "./Nodes/Controls/NodeControl";
import AnchorProp from "../Props/AnchorProp";
import NodeInfoModal from "./Modals/NodeInfoModal";
import MapOutput from "./Outputs/MapOutput";
import CounterOutput from "./Outputs/CounterOutput";
import TableOutput from "./Outputs/TableOutput";
import _ from "lodash";

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
    modalInfoShow: boolean,
    sparkServer: string,
    savedQueries: string[],
    expandedOutputs: any,
    outputsIcon: any,
    outputsColSize: number,
    alerts: any[],
    nodeTitle: string,
    nodeInfo: string
}

function AutoDismissibleAlerts(props: any) {
    const [visibleAlert, setAlertVisible] = useState(false); //--> init state

    const handleVisible = () => { //---> Last State for Alert
        setAlertVisible(true)
        setTimeout(() => { //---> 2 seconds later which is closing
            handleClose()
        }, 5000);
    }

    useEffect(() => {
        handleVisible();  //---> This is for Alert message
    }, []);

    function handleClose() {
        setAlertVisible(false);
        props.destroyAlert(props.id);
    }

    if (visibleAlert) {
        return (
            <Alert variant="danger" onClose={() => handleClose()} dismissible>
                <Alert.Heading>{props.title}</Alert.Heading>
                <p>
                    {props.body}
                </p>
            </Alert>
        );
    }
    return <></>;
}

class NodeCanvas extends Component<NodeCanvasProp, NodeCanvasState> {
    private ref: any;
    private websocket: any;
    private nodeRefs: any[];
    private outputRefs: any[];

    constructor(props: NodeCanvasProp) {
        super(props);

        this.ref = React.createRef();
        this.nodeRefs = [];
        this.outputRefs = [];

        let tmp: any[] = props.nodes.map((node) => {
            return this.createNode(node);
        });

        let sparkServer = localStorage.getItem("sparkServer");
        if (sparkServer === null) {
            sparkServer = ""
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
            modalInfoShow: false,
            sparkServer: sparkServer,
            savedQueries: savedQueries,
            expandedOutputs: "d-lg-block",
            outputsColSize: 3,
            outputsIcon: <Icon.ArrowLeft/>,
            alerts: [],
            nodeTitle: "Title",
            nodeInfo: "Information"
        }

    }

    componentDidMount = () => {
        this.connectWebSocket();
    }

    addAlert = (title: string, body: string) => {
        let tmp = this.state.alerts;
        tmp.push(<AutoDismissibleAlerts destroyAlert={this.destroyAlert} id={tmp.length} title={title} body={body}/>);
        this.setState({alerts: tmp});
    }

    destroyAlert = (id: number) => {
        let tmp = this.state.alerts;
        tmp[id] = undefined;
        this.setState({alerts: tmp});
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
            let data = JSON.parse(e["data"]);
            // console.log(data);
            if (data["type"] === "table") {
                this.loadTable(data["id"], data["data"]);
            } else if (data["type"] === "count") {
                this.loadCount(data["id"], data["data"]);
            } else if (data["type"] === "map") {
                this.loadMap(data["id"], data["data"], data["latitude"], data["longitude"], data["color"]);
            } else if (data["type"] === "error") {
                this.addAlert(data["title"], data["data"]);
            }
        };

        this.websocket.onopen = (e: any) => {
            this.setState({
                executeVariant: "success",
                canExecute: true
            });
        }
    }

    loadCount(id: any, data: any) {
        let counter: CounterOutput = this.outputRefs[id].current;

        counter.setCount(data);
    }

    loadMap(id: any, data: any, latitude: string, longitude: string, color: string) {
        // console.log(id);
        // console.log(data);

        let map = this.outputRefs[id].current;

        map.setColor(color);
        data.forEach((m: any) => {
            map.addMarker({lat: _.get(m, latitude), lon: _.get(m, longitude), popup: JSON.stringify(m, null, 4)});
        })
    }

    loadTable(id: any, data: any) {
        // console.log(id);
        // console.log(data);

        let columns: any = new Set();

        data.forEach((d: any) => {
            Object.keys(d).forEach((k) => {
                columns.add(k);
            });
        })

        // console.log(columns);

        let table = this.outputRefs[id].current;

        columns.forEach((c: string) => {
            table.addColumn(c)
        });

        let flat_data : any = [];

        data.forEach((x: any) => {
            var tmp: any = {};
            Object.keys(x).forEach((y: any) => {
                if(typeof x[y] === 'object' || typeof x[y] === 'boolean') {
                    tmp[y] = JSON.stringify(x[y]);
                }else{
                    tmp[y] = x[y];
                }
            });
            flat_data.push(tmp);
        });

        // console.log(flat_data);

        table.addRows(flat_data);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.sparkServer !== this.state.sparkServer) {
            // console.log(this.state.sparkServer);
            this.connectWebSocket();
        }
    }

    onSettingsSave = (data: any) => {
        this.setState({canExecute: false, executeVariant: "secondary", ...data});
        localStorage.setItem("sparkServer", data.sparkServer);
    }

    runCode = () => {
        let nodes = this.serializeQuery();
        this.clearOutputs();
        this.websocket.send(JSON.stringify({action: "query", nodes: nodes}));
    }

    clearOutputs = () => {
        this.outputRefs.forEach((t) => {
            t.current?.clear();
        });
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

            let anchor1 = this.nodeRefs[anchors[0].parent.props.index].current.getAnchorRef(anchors[0].index).current;
            let anchor2 = this.nodeRefs[anchors[1].parent.props.index].current.getAnchorRef(anchors[1].index).current;

            if (!anchor1.canConnect(anchor2)) {
                this.breakSVGLine();
                return;
            }

            let anchorBounds = e.getBoundingClientRect();
            let canvasBounds = this.ref.current.getBoundingClientRect();

            if (line != null) {
                line.x2 = anchorBounds.left - canvasBounds.left + 10;
                line.y2 = anchorBounds.top - canvasBounds.top + 10;

                line.anchorOne = anchors[0];
                line.anchorTwo = anchors[1];

                anchors.forEach((a) => {
                    let node_index = a.parent.props.index;
                    let anchor = this.nodeRefs[node_index].current.getAnchorRef(a.index).current;
                    anchor.addLine(line);
                });

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
        let node: NodeProp = data.newNode();

        if (node !== null) {
            tmp.push(this.createNode(node));
            this.setState({
                nodes: tmp,
                mouseMoved: false,
            });
        }

        if (data.onAdd !== null) {
            data.onAdd(this.nodeRefs.length - 1);
        }
    }

    private createNode(node: NodeProp) {
        console.log(node);
        node.anchorClickCallback = this.handleAnchorClick;
        this.nodeRefs.push(React.createRef());
        let id = this.nodeRefs.length - 1;
        return <NodeTemplate {...node} ref={this.nodeRefs[id]} key={"node_" + id} index={id} canvas={this.ref}
                             deleteNode={this.deleteNode} showInfoModal={this.showInfoModal}/>;
    }

    private deleteNode = (n: NodeTemplate) => {
        let tmpNodes: any[] = [...this.state.nodes];
        let tmpLines = [...this.state.lines];
        // console.log(tmpLines);
        console.log(n);

        n.anchorRefs.forEach((ar: any) => {
            // console.log(n);
            console.log(ar.current.state.lines);
            tmpLines = tmpLines.filter((l) => !ar.current.state.lines.includes(l));
            // tmpLines = [];
            // console.log(a.lines);
            // a.lines.forEach((l) => {
            //     if(l.anchorOne !== null && l.anchorTwo !== null) {
            //         l.anchorOne.lines = l.anchorOne.lines.filter((l) => !a.lines.includes(l));
            //         l.anchorTwo.lines = l.anchorTwo.lines.filter((l) => !a.lines.includes(l));
            //     }
            // });
        })

        n.deleteLines();
        if(n.onDelete){
            n.onDelete(n.props.index);
        }

        // console.log(tmpLines);

        tmpNodes[n.props.index] = undefined;
        this.nodeRefs[n.props.index] = undefined;

        this.setState({
            nodes: tmpNodes,
            lines: tmpLines
        });
    }

    private showInfoModal = (node: NodeProp) => {
        this.setState({modalInfoShow: true, nodeTitle: node.title, nodeInfo: node.info});
    }

    private addTable = (id: number) => {
        // console.log("Adding output for node " + id);
        let tmp: any[] = this.state.outputs.map(o => o);

        this.outputRefs[id] = React.createRef();

        tmp.push(<TableOutput ref={this.outputRefs[id]} columns={[]} data={[]} id={id}/>);

        this.setState({outputs: tmp});
    }

    private addMap = (id: number) => {
        // console.log("Adding output for node " + id);
        let tmp: any[] = this.state.outputs.map(o => o);

        this.outputRefs[id] = React.createRef();

        tmp.push(<MapOutput ref={this.outputRefs[id]} id={id}/>);

        this.setState({outputs: tmp});
    }

    private addCounter = (id: number) => {
        // console.log("Adding output for node " + id);
        let tmp: any[] = this.state.outputs.map(o => o);

        this.outputRefs[id] = React.createRef();

        tmp.push(<CounterOutput ref={this.outputRefs[id]} id={id}/>);

        this.setState({outputs: tmp});
    }

    private deleteOutput = (id: number) => {
        console.log(this.state.outputs);
        let outputs: any[] = this.state.outputs.filter(o => o.props.id !== id);
        console.log(outputs);
        this.setState({outputs: outputs});
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

    serializeQuery = () => {
        let nodes :any = {};

        this.nodeRefs.forEach((nr: any) => {

            if (nr) {

                let n = nr.current;

                let inputs: any[] = [];
                let aggs: any = null;
                n.anchorRefs.forEach((ar: any) => {

                    let a: AnchorProp = ar.current.props;
                    let lines: SVGLineProp[] = ar.current.state.lines;

                    if (a.type === "input" || a.type === "agg_input") {

                        let connections: any[] = [];

                        lines.forEach((l) => {
                            if (l.anchorOne != null && l.anchorTwo != null) {

                                if (l.anchorOne.parent.props.index === n.props.index) {
                                    connections.push(l.anchorTwo.parent.props.index)
                                } else {
                                    connections.push(l.anchorOne.parent.props.index)
                                }
                            }
                        });

                        if (a.type === "input")
                            inputs.push({name: a.name, connects_to: connections});

                        if (a.type === "agg_input")
                            aggs = {name: a.name, connects_to: connections};
                    }
                });

                let controls: any = [];
                n.controlRefs.forEach((cr: any) => {
                    let c: NodeControl = cr.current;
                    controls.push({name: c.name, value: c.getValue()});
                });

                let node = {id: n.props.index, type: n.type, inputs: inputs, controls: controls, aggs: aggs};
                nodes[n.props.index] = node;
            }

        });

        return nodes;
    }

    saveQuery = () => {
        // console.log("Saving query");

        let nodes = this.serializeQuery();
        // console.log(JSON.stringify(nodes));
        console.log(nodes);
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
                <Alert variant="warning" style={{marginTop: "15px"}}>
                    <Alert.Heading>Sin salidas</Alert.Heading>
                    <p>
                        Para ver resultados en este panel introduce salidas en la consulta.
                    </p>
                </Alert>
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
                        <Col>
                            {this.state.alerts}
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginBottom: "15px"}}>
                            <ButtonGroup aria-label="Tool buttons">


                                <Dropdown as={ButtonGroup}>
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
                                    <Dropdown.Toggle split variant={this.state.executeVariant} id="dropdown-split-basic"/>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={this.connectWebSocket}>Reconectar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

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
                        <Col className={"d-none " + this.state.expandedOutputs} lg={2}>
                            <Row>
                                <Col>
                                    <NodesSwatch addNode={this.addNode} addTable={this.addTable} addMap={this.addMap} addCounter={this.addCounter} deleteOutput={this.deleteOutput}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col className={"canvas-container d-none " + this.state.expandedOutputs} lg={7} style={{overflowX: "auto", whiteSpace: "nowrap"}}>
                            <div style={{width: "2000px", height: "750px"}}>
                            <div ref={this.ref} onMouseMove={this._onMouseMove} style={{height: "100%"}}>
                                {this.state.nodes}
                                <SVGCanvas lines={this.state.lines} breakSVGLine={this.breakSVGLine}/>
                            </div>
                            </div>
                        </Col>
                        <Col lg={this.state.outputsColSize}>
                            <Button className={"d-none d-lg-block"}
                                    onClick={this.toggleOutputs}>{this.state.outputsIcon}</Button>
                            <div id={"output_view"}>
                                {this.renderOutputs()}
                            </div>
                        </Col>
                    </Row>
                </Container>

                <SettingsModal
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
                <NodeInfoModal
                    show={this.state.modalInfoShow}
                    onHide={() => this.setState({modalInfoShow: false})}
                    title={this.state.nodeTitle}
                    body={this.state.nodeInfo}
                />
            </>
        );
    }

    private toggleOutputs = () => {
        if (this.state.expandedOutputs === "") {
            this.setState({expandedOutputs: "d-lg-block", outputsIcon: <Icon.ArrowLeft/>, outputsColSize: 3});
        } else {
            this.setState({expandedOutputs: "", outputsIcon: <Icon.ArrowRight/>, outputsColSize: 12});
        }
    }
}

export default NodeCanvas;