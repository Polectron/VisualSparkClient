import AnchorProp from "./AnchorProp";

abstract class NodeProp {
    x: number;
    y: number;
    type: string;
    class: string;
    index: number;
    inputs: AnchorProp[];
    outputs: AnchorProp[];
    agg_inputs: AnchorProp[];
    agg_outputs: AnchorProp[];
    controls: any;
    anchorClickCallback: any;
    canvas: any;
    title: string;
    deleteNode: any;
    onDelete: any;
    showInfoModal: any;
    info: string;

    protected constructor(x: number, y: number, title: string, ntype: string, nclass: string) {
        this.x = x;
        this.y = y;
        this.title = title;
        this.type = ntype;
        this.class = nclass;
        this.inputs = [];
        this.outputs = [];
        this.agg_inputs = [];
        this.agg_outputs = [];
        this.controls = [];
        this.index = -1;
        this.canvas = null;
        this.info = "";
    }

}

export default NodeProp;