import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Select extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Muestra", "sample", "filter");
        this.info = "Genera una muestra de los datos que recibe.";
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{type: "number", value: 100, name: "limit", min: 0, max: 100}];
    }
}

export default Select;