import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";
import NodeCanvas from "../../NodeCanvas";
import React from "react";
import GraphOutput from "../../Outputs/GraphOutput";
import _ from "lodash";

class GraphNode extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Gráfica", "graph", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.controls = [
            { type: "text", value: "", name: "x" },
            { type: "text", value: "", name: "y" },
            { type: "select", value: "", name: "type", options: [
                { "name": "Bar Chart", "value": "barchart" },
                { "name": "Line Chart", "value": "linechart" },
                { "name": "Pie", "value": "piechart" },
            ] }];
        this.onDelete = (canvas: NodeCanvas) => {canvas.deleteOutput(this.index)};
    }

    buildOutput = () => {
        this.outputRef = React.createRef();
        return <GraphOutput ref={this.outputRef} id={this.index} />
    }

    loadData = (data: any) => {
        let graph: GraphOutput = this.outputRef.current;

        graph.setType(data["graph_type"]);
        data["data"].forEach((p: any) => {
            let point = { x: _.get(p, data["x"]), y: _.get(p, data["y"]) };
            graph.addDataPoint(point);
        })
        graph.redraw();
    }
}

export default GraphNode;