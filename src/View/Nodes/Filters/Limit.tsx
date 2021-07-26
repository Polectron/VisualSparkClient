import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Limit extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Límite", "limit", "filter");
        this.info = "El límite sirve para limitar la cantidad de filas recuperadas.";
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{type: "number", value: "100", name: "limit"}];
    }
}

export default Limit;