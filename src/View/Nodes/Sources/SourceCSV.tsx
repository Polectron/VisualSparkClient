import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Source_CSV_Node extends NodeProps {
    constructor(x: number, y: number) {
        super(x, y, "Fuente CSV", "csvsource", "source");
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{
            type: "text",
            value: "",
            name: "source"
        }, {
            type: "text",
            value: "",
            name: "separator"
        }];
    }
}

export default Source_CSV_Node;