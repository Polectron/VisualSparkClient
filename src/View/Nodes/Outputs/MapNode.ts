import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";

class MapNode extends NodeProp {
    constructor(x: number, y: number, onDelete: any) {
        super(x, y, "Mapa", "map", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.controls = [
            { type: "text", value: "latitude", name: "latitude" },
            { type: "text", value: "longitude", name: "longitude" },
            { type: "select", value: "", name: "color", options: [
                { "name": "Blue", "value": "blue" },
                { "name": "Gold", "value": "gold" },
                { "name": "Red", "value": "red" },
                { "name": "Green", "value": "green" },
                { "name": "Orange", "value": "orange" },
                { "name": "Yellow", "value": "yellow" },
                { "name": "Violet", "value": "violet" },
                { "name": "Grey", "value": "grey" },
                { "name": "Black", "value": "black" }
            ] }];
        this.onDelete = onDelete;
    }
}

export default MapNode;