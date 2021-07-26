import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Select extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Select", "select", "filter");
        this.info = "Select permite elegir los campos que se recogen de la base de datos.";
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{type: "tags", value: "", name: "fields"}];
    }
}

export default Select;