import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Source_MongoDB_Node extends NodeProps {
    constructor(x: number, y: number) {
        super(x, y, "Fuente MongoDB", "mongodbsource", "source");
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{
            type: "text",
            value: "",
            name: "url"
        }, {
            type: "text",
            value: "",
            name: "database"
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

        this.info = "Obtén información de una base de datos de MongoDB";
    }
}

export default Source_MongoDB_Node;