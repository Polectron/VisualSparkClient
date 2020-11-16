import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Sum extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Suma", "sum", "aggr");
        this.agg_outputs = [new AnchorProp("DataFrame", this)];
        this.controls = [{type: "text", value: "", name:"column"}];
    }
}

export default Sum;