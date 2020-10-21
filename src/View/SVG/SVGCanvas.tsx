import React from "react";
import SVGLine from "./SVGLine";
import SVGLineProp from "../../Props/SVGLineProp";

type SVGCanvasProp = {
    lines: SVGLineProp[]
}

function SVGCanvas(prop : SVGCanvasProp){

    var lines = [];
    lines = prop.lines.map(l => <SVGLine x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}/>);

    return (
        <svg onMouseMove={(e)=>e.preventDefault()} id={"svg_canvas"}>
            {lines}
        </svg>
    );
}

export default SVGCanvas;