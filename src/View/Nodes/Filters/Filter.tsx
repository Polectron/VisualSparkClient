import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Filter extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Filtro", "filter", "filter");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{type: "text", value: "", name: "condition"}];
    }
}

export default Filter;