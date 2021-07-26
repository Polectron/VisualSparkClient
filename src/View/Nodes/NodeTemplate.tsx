import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Draggable from "react-draggable";
import * as Icon from "react-feather";
import AnchorProp from "../../Props/AnchorProp";
import { ContextMenu, MenuItem, showMenu } from "react-contextmenu";
import NodeProp from "../../Props/NodeProp";
import SVGLineProp from "../../Props/SVGLineProp";
import TextControl from "./Controls/TextControl";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PasswordControl from "./Controls/PasswordControl";
import SelectControl from "./Controls/SelectControl";
import TagsControl from "./Controls/TagsControl";
import NumberControl from './Controls/NumberControl';

class AnchorPoint extends React.Component<AnchorProp, any> {
    public ref: any;

    constructor(props: AnchorProp) {
        super(props);
        this.ref = React.createRef();

        this.state = {
            lines: [...this.props.lines]
        }
    }

    public updateLines = () => {
        // @ts-ignore
        let anchorBounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
        let canvasBounds = this.props.canvas.current.getBoundingClientRect();

        this.state.lines.forEach((l: SVGLineProp) => {
            let x = anchorBounds.left - canvasBounds.left + 10;
            let y = anchorBounds.top - canvasBounds.top + 10;

            if (l.anchorOne === this.props) {
                l.x1 = x;
                l.y1 = y;
            } else if (l.anchorTwo === this.props) {
                l.x2 = x;
                l.y2 = y;
            }
        })
    }

    public addLine = (line: SVGLineProp) => {
        // console.log("Adding line to anchor");
        let tmp = this.state.lines;
        tmp.push(line);
        this.setState({ lines: tmp });
    }

    public deleteLine = (line: SVGLineProp) => {
        // console.log("Deleting line from anchor");
        let tmp = [...this.state.lines];
        // console.log(tmp);
        tmp = tmp.filter((l: SVGLineProp) => l !== line);
        // console.log(tmp);
        this.setState({ lines: tmp });
        // console.log(this.state.lines);
    }

    public canConnect = (a: AnchorPoint): boolean => {
        // console.log(this.state.lines);
        // console.log(a.state.lines);
        if (["input"].includes(this.props.type) && this.state.lines.length >= 1) {
            return false;
        } else if (["input"].includes(a.props.type) && a.state.lines.length >= 1) {
            return false;
        }

        return a.props.accepts.includes(this.props.type) && this.props.accepts.includes(a.props.type);
    }

}

class InputTemplate extends AnchorPoint {
    render() {
        return (
            <div className="nd_input">
                <OverlayTrigger
                    delay={{ show: 350, hide: 300 }}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            {this.props.name}
                        </Tooltip>
                    }
                >
                    <div ref={this.ref} className="nd_input_anchor" onClick={() => {
                        this.props.anchorClickCallback(this.props, this.ref.current)
                    }} />
                </OverlayTrigger>
            </div>
        );
    }
}

class OutputTemplate extends AnchorPoint {
    render() {
        return (
            <div className="nd_output">
                <OverlayTrigger
                    delay={{ show: 350, hide: 300 }}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            {this.props.name}
                        </Tooltip>
                    }
                >
                    <div ref={this.ref} className="nd_output_anchor" onClick={() => {
                        this.props.anchorClickCallback(this.props, this.ref.current)
                    }} />
                </OverlayTrigger>
            </div>
        );
    }
}

class AggInput extends AnchorPoint {
    render() {
        return (
            <div className="nd_agginput">
                <OverlayTrigger
                    delay={{ show: 350, hide: 300 }}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            {this.props.name}
                        </Tooltip>
                    }
                >
                    <div ref={this.ref} className="nd_agginput_anchor" onClick={() => {
                        this.props.anchorClickCallback(this.props, this.ref.current)
                    }} />
                </OverlayTrigger>
            </div>
        );
    }
}

class AggOutput extends AnchorPoint {
    render() {
        return (
            <div className="nd_output">
                <OverlayTrigger
                    delay={{ show: 350, hide: 300 }}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            {this.props.name}
                        </Tooltip>
                    }
                >
                    <div ref={this.ref} className="nd_output_anchor" onClick={() => {
                        this.props.anchorClickCallback(this.props, this.ref.current)
                    }} />
                </OverlayTrigger>
            </div>
        );
    }
}

interface NodeTemplateSate {
    x: number,
    y: number,
    updateAnchors: boolean,
}

class NodeTemplate extends Component<NodeProp, NodeTemplateSate> {
    private inputs: any;
    private outputs: JSX.Element[];
    private agg_inputs: JSX.Element[];
    private agg_outputs: JSX.Element[];
    private controls: JSX.Element[];
    private class: string;
    private type: string;
    anchorRefs: any;
    private controlRefs: any;
    onDelete: any;

    constructor(props: NodeProp) {
        super(props);

        this.class = props.class;
        this.type = props.type;

        this.anchorRefs = [];
        this.controlRefs = [];

        this.state = {
            x: props.x,
            y: props.y,
            updateAnchors: false
        }

        this.inputs = [];
        this.inputs = props.inputs.map((input, id) =>
            <InputTemplate {...input}
                ref={this.setAnchorRef()}
                index={this.anchorRefs.length - 1}
                anchorClickCallback={props.anchorClickCallback}
                key={"input_anchor_" + id}
                canvas={props.canvas}
                parent={this} />);

        this.outputs = [];
        this.outputs = props.outputs.map((output, id) =>
            <OutputTemplate {...output}
                ref={this.setAnchorRef()}
                index={this.anchorRefs.length - 1}
                anchorClickCallback={props.anchorClickCallback}
                key={"output_anchor_" + id}
                canvas={props.canvas}
                parent={this} />);

        this.agg_inputs = [];
        this.agg_inputs = props.agg_inputs.map((extra, id) =>
            <AggInput {...extra}
                ref={this.setAnchorRef()}
                index={this.anchorRefs.length - 1}
                anchorClickCallback={props.anchorClickCallback}
                key={"extras_anchor_" + id}
                canvas={props.canvas}
                parent={this} />);

        this.agg_outputs = [];
        this.agg_outputs = props.agg_outputs.map((extra, id) =>
            <AggOutput {...extra}
                ref={this.setAnchorRef()}
                index={this.anchorRefs.length - 1}
                anchorClickCallback={props.anchorClickCallback}
                key={"extras_anchor_" + id}
                canvas={props.canvas}
                parent={this} />);

        this.controls = [];
        this.controls = props.controls.map((control: any, id: number) => {
            if (control.type === "text") {
                return <TextControl
                    name={control.name}
                    value={control.value}
                    ref={this.setControlRef()}
                    index={this.controlRefs.length - 1}
                    key={"control_" + id}
                    parent={this}

                />
            } else if (control.type === "number") {
                return <NumberControl
                    name={control.name}
                    value={control.value}
                    ref={this.setControlRef()}
                    index={this.controlRefs.length - 1}
                    key={"control_" + id}
                    parent={this}
                    min={control.min}
                    max={control.max}

                />
            } else if (control.type === "password") {
                return <PasswordControl
                    name={control.name}
                    value={control.value}
                    ref={this.setControlRef()}
                    index={this.controlRefs.length - 1}
                    key={"control_" + id}
                    parent={this}

                />
            } else if (control.type === "select") {
                return <SelectControl
                    name={control.name}
                    value={control.value}
                    options={control.options}
                    ref={this.setControlRef()}
                    index={this.controlRefs.length - 1}
                    key={"control_" + id}
                    parent={this}
                />
            } else if (control.type === "tags") {
                return <TagsControl
                    name={control.name}
                    value={control.value}
                    options={control.options}
                    ref={this.setControlRef()}
                    index={this.controlRefs.length - 1}
                    key={"control_" + id}
                    parent={this}
                />
            } else {
                return null;
            }
        }
        );
        this.onDelete = props.onDelete;
    }

    setAnchorRef = (): any => {
        let r = React.createRef();
        this.anchorRefs.push(r);
        return r;
    }

    setControlRef = (): any => {
        let r = React.createRef();
        this.controlRefs.push(r);
        return r;
    }

    handleDrag = (e: any, ui: any) => {
        this.setState({
            x: ui.x,
            y: ui.y,
            updateAnchors: true
        });
        this.updateLines();
    };

    updateLines = () => {
        this.anchorRefs.forEach((a: any) => {
            a.current.updateLines();
        })
    }

    deleteLines = () => {
        //encontrar todas las lineas que salen de este nodo
        //ir a los nodos conectados, linea por linea, decirles que borren esa linea
        this.anchorRefs.forEach((a: any) => {
            a.current.state.lines.forEach((l: SVGLineProp) => {
                // console.log(l.anchorOne?.parent);
                l.anchorOne?.parent.deleteLine(l);
                // console.log(l.anchorTwo?.parent);
                l.anchorTwo?.parent.deleteLine(l);
            })
        });
    }

    deleteLine = (line: SVGLineProp) => {
        console.log("Deleting line from node");
        this.anchorRefs.forEach((a: any) => {
            if (a.current) {
                a.current.deleteLine(line);
            }
        });
    }

    icon(class_name: string) {
        switch (class_name) {
            case "source":
                return <Icon.Database />;
            case "filter":
                return <Icon.Filter />;
        }
    }

    handleClick = (e: any) => {
        e.preventDefault();

        let showMenuConfig = {
            position: { x: e.pageX, y: e.pageY },
            target: null,
            id: `contextemenu_${this.props.index}`
        };

        showMenu(showMenuConfig);
    }

    getAnchorRef(index: number): string {
        return this.anchorRefs[index];
    }

    render() {
        return (
            <>
                <Draggable
                    bounds="parent"
                    onDrag={this.handleDrag}
                    defaultPosition={{ x: this.state.x, y: this.state.y }}>
                    <div id={"node"} className={`ignore_scroll node_block ${this.class}`} onContextMenu={this.handleClick}>
                        <div>
                            <div className="nd_container">
                                <div className="nd_inputs">
                                    {this.inputs}
                                </div>
                                <div className="nd_center">
                                    <div className={"nd_aggoutputs"}>
                                        {this.agg_outputs}
                                    </div>
                                    <div
                                        className="nd_title">{this.icon(this.class)} {this.props.title} ({this.props.index})
                                    </div>
                                    <div className={"nd_controls"}>
                                        {this.controls}
                                    </div>
                                    <div className={"nd_agginputs"}>
                                        {this.agg_inputs}
                                    </div>
                                </div>
                                <div className="nd_outputs">
                                    {this.outputs}
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>

                <ContextMenu id={`contextemenu_${this.props.index}`}>
                    <MenuItem onClick={() => {
                        this.props.deleteNode(this);
                    }}>
                        <Icon.Trash /> Eliminar
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem data={{ foo: 'bar' }} onClick={
                        () => { this.props.showInfoModal(this.props) }
                    }>
                        <Icon.HelpCircle /> Información
                    </MenuItem>
                </ContextMenu>

            </>
        );
    }
}

export default NodeTemplate;