import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Subtract extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Sustraer", "subtraction", "filter");
        this.inputs = [new AnchorProp("DataFrame", this), new AnchorProp("DataFrame", this)];
        this.outputs = [new AnchorProp("DataFrame", this)]
    }
}

export default Subtract;