import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class CounterNode extends NodeProp {
    constructor(x: number, y: number, onDelete: any) {
        super(x, y, "Contador", "count", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.onDelete = onDelete;
    }
}

export default CounterNode;