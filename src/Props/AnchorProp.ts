import SVGLineProp from "./SVGLineProp";

class AnchorProp{
    type?: string;
    name: string;
    lines: SVGLineProp[];
    anchorClickCallback?: any;
    parent: any;
    index: number;
    canvas: any;

    constructor(name: string, parent: any) {
        this.name = name;
        this.parent = parent;
        this.lines = [];
        this.index = -1;
        this.canvas = null;
    }
}

export default AnchorProp;