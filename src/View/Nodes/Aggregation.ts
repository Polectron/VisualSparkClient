import NodeProps from "../../Props/NodeProps";

class Aggregation extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Aggregation", "aggr");
        this.inputs = [{type:"DataFrame", name:"DataFrame", parent: this}];
        this.outputs = [{type:"DataFrame", name:"DataFrame", parent: this}]
    }
}

export default Aggregation;