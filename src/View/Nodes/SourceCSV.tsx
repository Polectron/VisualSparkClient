import NodeProps from "../../Props/NodeProps";

class Source_CSV_Node extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Fuente CSV", "source");
        this.outputs = [{type:"DataFrame", name:"DataFrame", parent: this}];
    }
}

export default Source_CSV_Node;