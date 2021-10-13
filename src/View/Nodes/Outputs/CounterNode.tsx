import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";
import NodeCanvas from "../../NodeCanvas";
import React from "react";
import CounterOutput from "../../Outputs/CounterOutput";

class CounterNode extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Contador", "counter", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.onDelete = (canvas: NodeCanvas) => {canvas.deleteOutput(this.index)};
    }

    buildOutput = () => {
        this.outputRef = React.createRef();
        return <CounterOutput ref={this.outputRef} id={this.index} />
    }

    loadData = (data: any) => {
        let counter: CounterOutput = this.outputRef.current;
        counter.setCount(data["data"]);
    }
}

export default CounterNode;