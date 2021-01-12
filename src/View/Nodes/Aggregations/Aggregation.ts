import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Aggregation extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Agregación", "aggregation", "aggr");
        this.inputs = [new AnchorProp("input", ["group", "output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.agg_inputs = [new AnchorProp("agg_input", ["agg_output"], "aggs", this)];
    }
}

export default Aggregation;