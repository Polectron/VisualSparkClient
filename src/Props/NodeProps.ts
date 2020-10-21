import InputProp from "./InputProp";
import OutputProp from "./OutputProp";
import NodeControls from "../View/Nodes/Controls/NodeControl";

type NodeProp2 = {

}

abstract class NodeProps{
    x: number;
    y: number;
    type: string;
    class: string;
    inputs: InputProp[];
    outputs: OutputProp[];
    controls: NodeControls;
    anchorClickCallback: any;

    protected constructor(x: number, y: number, ntype: string, nclass: string) {
        this.x = x;
        this.y = y;
        this.type = ntype;
        this.class = nclass;
        this.inputs = [];
        this.outputs = [];
        this.controls = new NodeControls();
    }

}

export default NodeProps;