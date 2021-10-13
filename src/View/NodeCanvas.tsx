import React, { Component, useState, useEffect } from 'react';
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
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SettingsModal from "./Modals/SettingsModal";
import QueriesModal from "./Modals/QueriesModal";
import NodesSwatch from "./NodesSwatch";
import NodeControl from "./Nodes/Controls/NodeControl";
import AnchorProp from "../Props/AnchorProp";
import NodeInfoModal from "./Modals/NodeInfoModal";
import html2canvas from 'html2canvas';
import Source_CSV_Node from './Nodes/Sources/SourceCSV';
import TableNode from './Nodes/Outputs/TableNode';
import Source_JDBC_Node from './Nodes/Sources/SourceJDBC';
import Source_MongoDB_Node from './Nodes/Sources/SourceMongoDB';
import Filter from './Nodes/Filters/Filter';
import Select from './Nodes/Filters/Select';
import Limit from './Nodes/Filters/Limit';
import Subtract from './Nodes/Filters/Subtract';
import Sample from './Nodes/Filters/Sample';
import GroupBy from './Nodes/Aggregations/GroupBy';
import Aggregation from './Nodes/Aggregations/Aggregation';
import Count from './Nodes/Aggregations/Count';
import MapNode from './Nodes/Outputs/MapNode';
import GraphNode from './Nodes/Outputs/GraphNode';
import CounterNode from './Nodes/Outputs/CounterNode';
import Sum from './Nodes/Aggregations/Sum';
import Avg from './Nodes/Aggregations/Avg';
import Min from './Nodes/Aggregations/Min';
import Max from './Nodes/Aggregations/Max';
import { v4 as uuidv4 } from 'uuid';

interface NodeCanvasState {
    selectedAnchors: any[],
    lines: SVGLineProp[],
    nodes: JSX.Element[],
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
    savedqueries: any[],
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    private nodeRefs: Record<number, any>;

    constructor(props: NodeCanvasProp) {
        super(props);

        this.ref = React.createRef();
        this.nodeRefs = {};

        let sparkServer = localStorage.getItem("sparkServer");
        if (sparkServer === null) {
            sparkServer = "";
        }

        let savedqueriesjson = localStorage.getItem("savedqueries");
        if (savedqueriesjson === null) {
            savedqueriesjson = "[]";
        }
        let savedqueries = JSON.parse(savedqueriesjson);

        this.websocket = null;

        this.state = {
            selectedAnchors: [],
            lines: [],
            nodes: [],
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
            savedqueries: savedqueries,
            expandedOutputs: "d-lg-block",
            outputsColSize: 3,
            outputsIcon: <Icon.ArrowLeft />,
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
        tmp.push(<AutoDismissibleAlerts destroyAlert={this.destroyAlert} id={tmp.length} title={title} body={body} />);
        this.setState({ alerts: tmp });
    }

    destroyAlert = (id: number) => {
        let tmp = this.state.alerts;
        tmp[id] = undefined;
        this.setState({ alerts: tmp });
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
            let node: NodeTemplate;
            if ("id" in data) {
                node = this.nodeRefs[data["id"]].current;
                node.props.getOutput().current.clear();
                node.loadData(data);
            } else {
                if (data["type"] === "error") {
                    this.addAlert(data["title"], data["data"]);
                }
            }
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
            // console.log(this.state.sparkServer);
            this.connectWebSocket();
        }
    }

    onSettingsSave = (data: any) => {
        this.setState({ canExecute: false, executeVariant: "secondary", ...data });
        localStorage.setItem("sparkServer", data.sparkServer);
    }

    runCode = () => {
        let nodes = this.serializeQuery();
        this.websocket.send(JSON.stringify({ action: "query", nodes: nodes }));
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

    buildNode = (type: string, x: number, y: number) => {
        // console.log(type);
        let node: any;
        if(type === "csvsource"){
            node = new Source_CSV_Node(x, y);
        }else if(type === "jdbcsource"){
            node = new Source_JDBC_Node(x, y);
        }else if(type === "mongodbsource"){
            node = new Source_MongoDB_Node(x, y);
        }else if(type === "filter"){
            node = new Filter(x, y);
        }else if(type === "select"){
            node = new Select(x, y);
        }else if(type === "limit"){
            node = new Limit(x, y);
        }else if(type === "subtraction"){
            node = new Subtract(x, y)
        }else if(type === "sample"){
            node = new Sample(x, y);
        }else if(type === "groupby"){
            node = new GroupBy(x, y);
        }else if(type === "aggregation"){
            node = new Aggregation(x, y);
        }else if(type === "count"){
            node = new Count(x, y);
        }else if(type === "sum"){
            node = new Sum(x, y);
        }else if(type === "avg"){
            node = new Avg(x, y);
        }else if(type === "min"){
            node = new Min(x, y);
        }else if(type === "max"){
            node = new Max(x, y);
        }else if(type === "table"){
            node =  new TableNode(x, y);
        }else if(type === "map"){
            node = new MapNode(x, y);
        }else if(type === "graph"){
            node = new GraphNode(x, y);
        }else if(type === "counter"){
            node = new CounterNode(x, y);
        }

        return node;
    }

    addNode = (node: NodeProp) => {
        let tmpnodes: any[] = [...this.state.nodes];
        let tmpoutputs: any[] = [...this.state.outputs];

        if (node !== null) {
            tmpnodes.push(this.createNode(node));
            if (node.buildOutput !== null) {
                tmpoutputs.push(node.buildOutput(this));
            }
            this.setState({
                nodes: tmpnodes,
                outputs: tmpoutputs,
                mouseMoved: false,
            });
        }
    }

    private createNode(node: NodeProp, id?: number) {
        if (typeof id === "undefined") {
            // id = uuidv4();
            let keys: any = Object.keys(this.nodeRefs);
            let ids: number[] = [0, ...keys];
            id = Math.max(...ids) + 1;
        }
        node.index = id;
        node.anchorClickCallback = this.handleAnchorClick;
        this.nodeRefs[id] = React.createRef();
        return <NodeTemplate {...node} ref={this.nodeRefs[id]} key={"node_" + id} index={id} canvas={this.ref}
            deleteNode={this.deleteNode} showInfoModal={this.showInfoModal} />;
    }

    private deleteNode = (n: NodeTemplate) => {
        let tmpNodes: any[] = this.state.nodes.map(node => node);
        let tmpLines = [...this.state.lines];

        n.anchorRefs.forEach((ar: any) => {
            // console.log(ar.current.state.lines);
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
        if (n.onDelete) {
            n.onDelete(this);
        }

        // console.log(tmpLines);

        tmpNodes = tmpNodes.filter( node => node.props.index !== n.props.index);
        this.nodeRefs[n.props.index] = undefined;

        this.setState({
            nodes: tmpNodes,
            lines: tmpLines
        });
    }

    private showInfoModal = (node: NodeProp) => {
        this.setState({ modalInfoShow: true, nodeTitle: node.title, nodeInfo: node.info });
    }

    addOutput = (output: any) => {
        let tmp: any[] = this.state.outputs.map(o => o);
        tmp.push(output);
        this.setState({ outputs: tmp });
    }

    deleteOutput = (id: number) => {
        let outputs: any[] = this.state.outputs.filter(o => o.props.id !== id);
        this.setState({ outputs: outputs });
    }

    _onMouseMove = (e: any) => {

        let bounds = this.ref.current.getBoundingClientRect();
        let x = e.pageX - bounds.left - window.scrollX;
        let y = e.pageY - bounds.top - window.scrollY;

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
        let nodes: any = {};

        // let key: any = null;
        let value: any = null;
        // build nodes
        // {"id":0,"type":"csvsource","inputs":[],"controls":[{"name":"source","value":"https://people.sc.fsu.edu/~jburkardt/data/csv/deniro.csv"},{"name":"separator","value":", "}],"aggs":null}
        for (value of Object.values(this.nodeRefs)) {
            if (value) {

                let n = value.current;

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
                            inputs.push({ name: a.name, connects_to: connections });

                        if (a.type === "agg_input")
                            aggs = { name: a.name, connects_to: connections };
                    }
                });

                let controls: any = [];
                n.controlRefs.forEach((cr: any) => {
                    let c: NodeControl = cr.current;
                    controls.push({ name: c.name, value: c.getValue() });
                });

                let node = { id: n.props.index, type: n.type, inputs: inputs, controls: controls, aggs: aggs, x: n.state.x, y: n.state.y };
                nodes[n.props.index] = node;
            }

        };

        return nodes;
    }

    saveQuery = () => {
        let queryname = prompt("Nombre de la consulta", `Consulta ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}`);
        if (queryname !== null && queryname !== "") {
            let nodes = this.serializeQuery();
            let tmpsavedqueries = [...this.state.savedqueries];
            let svgCanvas: HTMLElement | null = document.body.querySelector("#root > div.container > div:nth-child(3) > div.canvas-container.d-none.d-lg-block.col-lg-7");
            if (svgCanvas)
                html2canvas(svgCanvas).then((canvas) => {
                    let imgURL = canvas.toDataURL();
                    tmpsavedqueries.push({ "name": queryname, "img": imgURL, "tree": nodes });
                    this.setState({ savedqueries: tmpsavedqueries });
                    localStorage.setItem("savedqueries", JSON.stringify(tmpsavedqueries));
                });
        }
    }

    clearCurrentQuery = (callback: any) => {
        if (callback === null){
            callback = () => {};
        }
        let ask: Boolean = this.state.nodes.length > 0;
        let dodelete: Boolean = true;
        if(ask){
            dodelete = window.confirm(`¿Vaciar consulta actual?`);
        }
        if (dodelete) {
            this.nodeRefs = [];

            this.setState({
                nodes: [],
                lines: [],
                outputs: []
            }, callback);
        }
    }

    openSavedQuery = (id: any, callback: any) => {  
        let canvasBounds = this.ref.current.getBoundingClientRect();

        let sleep = (time: number) => {
            return new Promise((resolve)=>setTimeout(resolve,time)
          )
        }

        let open = () => {
            callback();
            let query = this.state.savedqueries[id];
            // let key: any = null;
            let value: any = null;
            let nodes: Record<number, any> = {};
            let tmpnodes: any = [];
            let tmpoutputs: any = [];
            // build nodes
            // {"id":0,"type":"csvsource","inputs":[],"controls":[{"name":"source","value":"https://people.sc.fsu.edu/~jburkardt/data/csv/deniro.csv"},{"name":"separator","value":", "}],"aggs":null}
            // {"id":1,"type":"table","inputs":[{"name":"DataFrame","connects_to":[0]}],"controls":[],"aggs":null,"x":478,"y":82}
            for (value of Object.values(query.tree)) {
                let node: any = this.buildNode(value.type, value.x, value.y);
                // console.log(`${key}: ${JSON.stringify(value)}`);
                nodes[value.id] = node;
                tmpnodes.push(this.createNode(node, value.id));
                if (node.buildOutput !== null) {
                    tmpoutputs.push(node.buildOutput(this));
                }
            }
            this.setState({nodes: tmpnodes, outputs: tmpoutputs});

            // tmpnodes.forEach((n: any) => {
            //     console.log(n);
            // });

            sleep(1000).then(()=>{
                let tmplines: any[] = [...this.state.lines];
                for (value of Object.values(query.tree)) {
                    // console.log(this.nodeRefs[value.id].current.anchorRefs);
                    // set control values
                    for(let i = 0; i < value.controls.length; i++) {
                        this.nodeRefs[value.id].current.controlRefs[i].current.setState({value:value.controls[i].value});
                    }
                    // connect nodes
                    for(let i = 0; i < value.inputs.length; i++) {
                        // console.log(value.inputs[i].connects_to);
                        for(let j = 0; j < value.inputs[i].connects_to.length; j++) {
                            // this.nodeRefs[value.id].current.controlRefs[i].current.setState({value:value.controls[i].value});
                            let a1 = this.nodeRefs[value.id].current.anchorRefs.filter((ref: any) => ref.current.props.type==="input")[0].current;
                            let a1_bounds = a1.ref.current.getBoundingClientRect();
                            let a2 = this.nodeRefs[value.inputs[i].connects_to[j]].current.anchorRefs.filter((ref: any) => ref.current.props.type==="output")[0].current;
                            let a2_bounds = a2.ref.current.getBoundingClientRect();
                            // console.log(this.nodeRefs[value.id].current.anchorRefs.filter((ref: any) => ref.current.props.type==="input")[0].current);
                            // console.log(this.nodeRefs[value.id].current.anchorRefs.filter((ref: any) => ref.current.props.type==="input")[0].current.ref.current.getBoundingClientRect());
                            // console.log(this.nodeRefs[value.inputs[i].connects_to[j]].current.anchorRefs.filter((ref: any) => ref.current.props.type==="output")[0].current);
                            // console.log(this.nodeRefs[value.inputs[i].connects_to[j]].current.anchorRefs.filter((ref: any) => ref.current.props.type==="output")[0].current.ref.current.getBoundingClientRect());

                            let line = {
                                x1: a1_bounds.left - canvasBounds.left + 10,
                                y1: a1_bounds.top - canvasBounds.top + 10,
                                x2: a2_bounds.left - canvasBounds.left + 10,
                                y2: a2_bounds.top - canvasBounds.top + 10,
                                anchorOne: a1.props,
                                anchorTwo: a2.props
                            };

                            tmplines.push(line);
                            a1.addLine(line);
                            a2.addLine(line);
                        }
                    }

                    this.setState({lines: tmplines});
                }
            });
        }

        this.clearCurrentQuery(open);
    }

    deleteSavedQuery = (id: number) => {
        if (window.confirm(`¿Eliminar ${this.state.savedqueries[id].name}?`)) {
            let tmpsavedqueries = this.state.savedqueries.filter( (query, index) => index !== id);
            this.setState({ savedqueries: tmpsavedqueries });
            localStorage.setItem("savedqueries", JSON.stringify(tmpsavedqueries));
        }
    }

    breakSVGLine = () => {
        let tmpLines = this.state.lines;
        if (this.state.currentLine) {
            tmpLines = tmpLines.filter(x => x !== this.state.currentLine);
        }
        this.setState({ currentLine: null, lines: tmpLines, selectedAnchors: [] })
    }

    renderOutputs = () => {
        if (this.state.outputs.length <= 0) {
            return (
                <Alert variant="warning" style={{ marginTop: "15px" }}>
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
                        <Button className="p-2" onClick={() => this.setState({ modalQueriesShow: true })}>Explorar
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
                        <Col style={{ marginBottom: "15px" }}>
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
                                            variant={this.state.executeVariant}><Icon.Play /></Button>

                                    </OverlayTrigger>
                                    <Dropdown.Toggle split variant={this.state.executeVariant} id="dropdown-split-basic" />

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={this.connectWebSocket}>Reconectar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Button onClick={this.saveQuery}>
                                    <Icon.Save />
                                </Button>
                                <Button onClick={() => this.clearCurrentQuery(null)}
                                    variant={"danger"}><Icon.XCircle /></Button>
                                <Button onClick={() => this.setState({ modalShow: true })}
                                    variant={"secondary"}><Icon.Settings /></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={"d-none " + this.state.expandedOutputs} lg={2}>
                            <Row>
                                <Col>
                                    <NodesSwatch addNode={this.addNode} buildNode={this.buildNode}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col className={"canvas-container d-none " + this.state.expandedOutputs} lg={7} style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                            <div style={{ width: "2000px", height: "750px" }}>
                                <div ref={this.ref} onMouseMove={this._onMouseMove} style={{ height: "100%" }}>
                                    {this.state.nodes}
                                    <SVGCanvas lines={this.state.lines} breakSVGLine={this.breakSVGLine} />
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
                    onHide={() => this.setState({ modalShow: false })}
                    onSave={this.onSettingsSave}
                />
                <QueriesModal
                    savedqueries={this.state.savedqueries}
                    show={this.state.modalQueriesShow}
                    onHide={() => this.setState({ modalQueriesShow: false })}
                    openSavedQuery={(id: number, callback: any) => { this.openSavedQuery(id, callback) }}
                    deleteSavedQuery={(id: number) => { this.deleteSavedQuery(id) }}
                />
                <NodeInfoModal
                    show={this.state.modalInfoShow}
                    onHide={() => this.setState({ modalInfoShow: false })}
                    title={this.state.nodeTitle}
                    body={this.state.nodeInfo}
                />
            </>
        );
    }

    private toggleOutputs = () => {
        if (this.state.expandedOutputs === "") {
            this.setState({ expandedOutputs: "d-lg-block", outputsIcon: <Icon.ArrowLeft />, outputsColSize: 3 });
        } else {
            this.setState({ expandedOutputs: "", outputsIcon: <Icon.ArrowRight />, outputsColSize: 12 });
        }
    }
}

export default NodeCanvas;