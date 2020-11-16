import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Source_JDBC_Node extends NodeProps {
    constructor(x: number, y: number) {
        super(x, y, "Fuente JDBC", "jdbcsource", "source");
        this.outputs = [new AnchorProp("DataFrame", this)];
        this.controls = [{
            type: "text",
            value: "",
            name: "url"
        }, {
            type: "text",
            value: "",
            name: "table"
        }, {
            type: "text",
            value: "",
            name: "user"
        }, {
            type: "password",
            value: "",
            name: "password"
        }];
    }
}

export default Source_JDBC_Node;