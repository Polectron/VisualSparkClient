import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class GroupBy extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Agrupar", "groupby", "aggr");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("group", ["input"], "DataFrame", this)];
        this.controls = [{type: "text", value: "", name: "columns"}];
    }
}

export default GroupBy;