import NodeProps from "../../Props/NodeProp";
import AnchorProp from "../../Props/AnchorProp";

class Subtract extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Substraer", "filter");
        this.inputs = [new AnchorProp("DataFrame", "DataFrame", this), new AnchorProp("DataFrame", "DataFrame", this)];
        this.outputs = [new AnchorProp("DataFrame", "DataFrame", this)]
    }
}

export default Subtract;