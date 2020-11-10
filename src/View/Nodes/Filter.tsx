import NodeProp from "../../Props/NodeProp";
import AnchorProp from "../../Props/AnchorProp";
import TextControl from "./Controls/TextControl";
import React from "react";

class Filter extends NodeProp{
    constructor(x: number, y: number) {
        super(x, y, "Filtro", "filter");
        this.inputs = [new AnchorProp("DataFrame", "DataFrame", this)];
        this.outputs = [new AnchorProp("DataFrame", "DataFrame", this)];
        this.controls = [<TextControl name={"filter"}/>];
    }
}

export default Filter;