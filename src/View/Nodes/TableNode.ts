import NodeProps from "../../Props/NodeProps";

class TableNode extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Tabla", "output");
        this.inputs = [{type:"DataFrame", name:"DataFrame", parent: this}];
        this.outputs = []
    }
}

export default TableNode;