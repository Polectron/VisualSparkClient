import AnchorProp from "./AnchorProp";

abstract class NodeProp{
    x: number;
    y: number;
    type: string;
    class: string;
    index: number;
    inputs: AnchorProp[];
    outputs: AnchorProp[];
    extras: AnchorProp[];
    controls: any;
    anchorClickCallback: any;
    canvas: any;

    protected constructor(x: number, y: number, ntype: string, nclass: string) {
        this.x = x;
        this.y = y;
        this.type = ntype;
        this.class = nclass;
        this.inputs = [];
        this.outputs = [];
        this.extras = [];
        this.controls = [];
        this.index = -1;
        this.canvas = null;
    }

}

export default NodeProp;