import NodeProps from "../../Props/NodeProp";
import AnchorProp from "../../Props/AnchorProp";
import TextControl from "./Controls/TextControl";
import React from "react";

class Source_CSV_Node extends NodeProps{
    constructor(x: number, y: number) {
        super(x, y, "Fuente CSV", "source");
        this.outputs = [new AnchorProp("DataFrame", "DataFrame", this)];
        this.controls = [<TextControl name={"source"}/>];
    }
}

export default Source_CSV_Node;