import NodeProps from "../../Props/NodeProps";

class Filter extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Filtro", "filter");
        this.inputs = [{type:"DataFrame", name:"DataFrame", parent: this}];
        this.outputs = [{type:"DataFrame", name:"DataFrame", parent: this}]
    }
}

export default Filter;