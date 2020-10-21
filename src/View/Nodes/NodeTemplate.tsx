import React, {Component, useRef} from 'react';
import NodeProps from "../../Props/NodeProps";
import Draggable from "react-draggable";
import * as Icon from "react-feather";
import InputProp from "../../Props/InputProp";
import OutputProp from "../../Props/OutputProp";
import NodeControls from "./Controls/NodeControl";
import {ContextMenu, MenuItem, showMenu} from "react-contextmenu";


const { randomInt } = require('mathjs');

function InputTemplate(prop: InputProp) {

    const ref = useRef(null);

    return (
        <div className="nd_input">
            <div ref={ref} className="nd_input_anchor" onClick={()=>{prop.anchorClickCallback(prop, ref.current)}}></div>
        </div>
    );
}

function OutputTemplate(prop: OutputProp) {

    const ref = useRef(null);

    return (
        <div className="nd_output">
            <div ref={ref} className="nd_output_anchor" onClick={()=>{prop.anchorClickCallback(prop, ref.current)}}></div>
        </div>
    );
}

interface IState {
    x: number,
    y: number
}

class NodeTemplate extends Component<NodeProps, IState> {
    private inputs: JSX.Element[];
    private outputs: JSX.Element[];

    private controls: NodeControls;
    private class: string;
    private type: string;
    private node_id: number;

    constructor(props: NodeProps) {
        super(props);

        this.class = props.class;
        this.type = props.type;

        this.inputs = [];
        this.inputs = props.inputs.map(input => <InputTemplate {...input}
                                                               anchorClickCallback={props.anchorClickCallback}
                                                               parent={this}></InputTemplate>);

        this.outputs = [];
        this.outputs = props.outputs.map(output => <OutputTemplate {...output}
                                                                   anchorClickCallback={props.anchorClickCallback}
                                                                   parent={this}></OutputTemplate>);

        this.controls = props.controls;

        this.state = {
            x: props.x,
            y: props.y
        }

        this.node_id = randomInt(100);

    }


    handleDrag = (e: any, ui: any) => {
        this.setState({
            x: ui.x,
            y: ui.y,
        });
    };


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
            position: { x:e.pageX, y:e.pageY },
            target: null,
            id: `contextemenu_${this.node_id}`
        };

        showMenu(showMenuConfig);
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
                                <div className="nd_controls">
                                    <div className="nd_title">{this.icon(this.class)} {this.type}</div>
                                    {this.controls.render()}
                                </div>
                                <div className="nd_outputs">
                                    {this.outputs}
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>

                <ContextMenu id={`contextemenu_${this.node_id}`}>
                    <MenuItem data={{foo: 'bar'}} onClick={()=>{alert("Eliminar")}}>
                        Eliminar
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem data={{foo: 'bar'}} onClick={()=>{alert("Información")}}>
                        <Icon.HelpCircle></Icon.HelpCircle>Información
                    </MenuItem>
                </ContextMenu>

            </>
        );
    }

}

export default NodeTemplate;