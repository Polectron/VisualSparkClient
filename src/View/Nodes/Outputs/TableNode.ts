import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class TableNode extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Tabla", "table", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
    }
}

export default TableNode;