import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class GraphNode extends NodeProp {
    constructor(x: number, y: number, onDelete: any) {
        super(x, y, "Gráfica", "graph", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.controls = [
            { type: "text", value: "", name: "x" },
            { type: "text", value: "", name: "y" },
            { type: "select", value: "", name: "type", options: [
                { "name": "Bar Chart", "value": "barchart" },
                { "name": "Line Chart", "value": "linechart" },
                { "name": "Pie", "value": "pie" },
            ] }];
        this.onDelete = onDelete;
    }
}

export default GraphNode;