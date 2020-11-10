import NodeProp from "../../Props/NodeProp";
import AnchorProp from "../../Props/AnchorProp";

class Aggregation extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Aggregation", "aggr");
        this.inputs = [new AnchorProp("DataFrame", "DataFrame", this)];
        this.outputs = [new AnchorProp("DataFrame", "DataFrame", this)];
        this.extras = [new AnchorProp("DataFrame", "DataFrame", this), new AnchorProp("DataFrame", "DataFrame", this)];
    }
}

export default Aggregation;