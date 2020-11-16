import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Min extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Mínimo", "min", "aggr");
        this.agg_outputs = [new AnchorProp("DataFrame", this)];
        this.controls = [{type: "text", value: "", name:"column"}];
    }
}

export default Min;