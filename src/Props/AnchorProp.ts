import SVGLineProp from "./SVGLineProp";

class AnchorProp{
    type: string;
    name: string;
    lines: SVGLineProp[];
    anchorClickCallback?: any;
    parent: any;
    index: number;
    canvas: any;

    constructor(type: string, name: string, parent: any) {
        this.type = type;
        this.name = name;
        this.parent = parent;
        this.lines = [];
        this.index = -1;
        this.canvas = null;
    }
}

export default AnchorProp;