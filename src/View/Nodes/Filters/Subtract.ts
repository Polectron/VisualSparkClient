import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Subtract extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Sustraer", "subtraction", "filter");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this), new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"],"DataFrame", this)]
    }
}

export default Subtract;