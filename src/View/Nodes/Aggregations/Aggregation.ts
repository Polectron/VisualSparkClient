import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Aggregation extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Agregación", "aggregation", "aggr");
        this.inputs = [new AnchorProp("DataFrame", this)];
        this.outputs = [new AnchorProp("DataFrame", this)];
        this.agg_inputs = [new AnchorProp("aggs", this)];
    }
}

export default Aggregation;