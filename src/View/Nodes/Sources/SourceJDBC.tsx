import NodeProps from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class Source_JDBC_Node extends NodeProps {
    constructor(x: number, y: number) {
        super(x, y, "Fuente JDBC", "jdbcsource", "source");
        this.outputs = [new AnchorProp("output", ["input"], "DataFrame", this)];
        this.controls = [{
            type: "select",
            value: "",
            name: "driver",
            options: [{"name": "MySQL", "value": "mysql"}, {"name": "PostgreSQL", "value": "postgresql"}]
        }, {
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

        this.info = "Obtén información de una fuente compatible con el conector JDBC";
    }
}

export default Source_JDBC_Node;