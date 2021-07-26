import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Count extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Contar", "count", "aggr");
        this.agg_outputs = [new AnchorProp("agg_output", ["agg_input"], "DataFrame", this)];
        this.controls = [{type: "text", value: "", name: "column"}];
    }
}

export default Count;