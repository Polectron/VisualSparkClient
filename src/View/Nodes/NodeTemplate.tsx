import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Draggable from "react-draggable";
import * as Icon from "react-feather";
import AnchorProp from "../../Props/AnchorProp";
import {ContextMenu, MenuItem, showMenu} from "react-contextmenu";
import NodeProp from "../../Props/NodeProp";
import SVGLineProp from "../../Props/SVGLineProp";
import TextControl from "./Controls/TextControl";

class AnchorPoint extends React.Component<AnchorProp, any> {
    public ref: any;

    constructor(props: AnchorProp) {
        super(props);
        this.ref = React.createRef();
    }

    public updateLines = () => {
        // @ts-ignore
        let anchorBounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
        let canvasBounds = this.props.canvas.current.getBoundingClientRect();

        this.props.lines.forEach((l) => {
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
        this.props.lines.push(line);
    }
}

class InputTemplate extends AnchorPoint {
    render() {
        return (
            <div className="nd_input">
                <div ref={this.ref} className="nd_input_anchor" onClick={() => {
                    this.props.anchorClickCallback(this.props, this.ref.current)
                }}></div>
            </div>
        );
    }
}

class OutputTemplate extends AnchorPoint {
    render() {
        return (
            <div className="nd_output">
                <div ref={this.ref} className="nd_output_anchor" onClick={() => {
                    this.props.anchorClickCallback(this.props, this.ref.current)
                }}></div>
            </div>
        );
    }
}

class ExtraTemplate extends AnchorPoint {
    render() {
        return (
            <div className="nd_extra">
                <div ref={this.ref} className="nd_extra_anchor" onClick={() => {
                    this.props.anchorClickCallback(this.props, this.ref.current)
                }}></div>
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
    private extras: JSX.Element[];

    private controls: JSX.Element[];
    private class: string;
    private type: string;
    private anchorRefs: any;
    private controlRefs: any;

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
                           parent={this}/>);

        this.outputs = [];
        this.outputs = props.outputs.map((output, id) =>
            <OutputTemplate {...output}
                            ref={this.setAnchorRef()}
                            index={this.anchorRefs.length - 1}
                            anchorClickCallback={props.anchorClickCallback}
                            key={"output_anchor_" + id}
                            canvas={props.canvas}
                            parent={this}/>);

        this.extras = [];
        this.extras = props.extras.map((extra, id) =>
            <ExtraTemplate {...extra}
                           ref={this.setAnchorRef()}
                           index={this.anchorRefs.length - 1}
                           anchorClickCallback={props.anchorClickCallback}
                           key={"extras_anchor_" + id}
                           canvas={props.canvas}
                           parent={this}/>);

        this.controls = [];
        this.controls = props.controls.map((control: any, id: number) =>
            <TextControl
                ref={this.setControlRef()}
                index={this.controlRefs.length - 1}
                key={"control_" + id}
                parent={this}
            />);
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

    icon(class_name: string) {
        switch (class_name) {
            case "source":
                return <Icon.Database></Icon.Database>;
            case "filter":
                return <Icon.Filter></Icon.Filter>;
        }
    }

    handleClick = (e: any) => {
        e.preventDefault();

        let showMenuConfig = {
            position: {x: e.pageX, y: e.pageY},
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
                    defaultPosition={{x: this.state.x, y: this.state.y}}>
                    <div id={"node"} className={`node_block ${this.class}`} onContextMenu={this.handleClick}>
                        <div>
                            <div className="nd_container">
                                <div className="nd_inputs">
                                    {this.inputs}
                                </div>
                                <div className="nd_center">
                                    <div className="nd_title">{this.icon(this.class)} {this.type}</div>
                                    <div className={"nd_controls"}>
                                        {this.controls}
                                    </div>
                                    <div className={"nd_extras"}>
                                        {this.extras}
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
                    <MenuItem data={{foo: 'bar'}} onClick={() => {
                        alert("Eliminar")
                    }}>
                        Eliminar
                    </MenuItem>
                    <MenuItem divider/>
                    <MenuItem data={{foo: 'bar'}} onClick={() => {
                        alert("Información")
                    }}>
                        <Icon.HelpCircle></Icon.HelpCircle>Información
                    </MenuItem>
                </ContextMenu>

            </>
        );
    }

}

export default NodeTemplate;