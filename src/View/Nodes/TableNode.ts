import NodeProp from "../../Props/NodeProp";
import AnchorProp from "../../Props/AnchorProp";

class TableNode extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Tabla", "output");
        this.inputs = [new AnchorProp("DataFrame", "DataFrame", this)];
    }
}

export default TableNode;