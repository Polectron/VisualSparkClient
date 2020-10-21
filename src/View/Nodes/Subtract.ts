import NodeProps from "../../Props/NodeProps";

class Subtract extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Substraer", "filter");
        this.inputs = [{type:"DataFrame", name:"DataFrame", parent: this}, {type:"DataFrame", name:"DataFrame", parent: this}];
        this.outputs = [{type:"DataFrame", name:"DataFrame", parent: this}]
    }
}

export default Subtract;