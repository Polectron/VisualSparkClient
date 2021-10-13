import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";
import NodeCanvas from "../../NodeCanvas";
import React from "react";
import MapOutput from "../../Outputs/MapOutput";
import _ from "lodash";

class MapNode extends NodeProp {
    constructor(x: number, y: number) {
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
        this.onDelete = (canvas: NodeCanvas) => {canvas.deleteOutput(this.index)};
    }

    buildOutput = () => {
        this.outputRef = React.createRef();
        return <MapOutput ref={this.outputRef} id={this.index} />
    }

    loadData = (data: any) => {
        let map: MapOutput = this.outputRef.current;
        map.setColor(data["color"]);
        data["data"].forEach((m: any) => {
            map.addMarker({ lat: _.get(m, data["latitude"]), lon: _.get(m, data["longitude"]), popup: JSON.stringify(m, null, 4) });
        })
    }
}

export default MapNode;