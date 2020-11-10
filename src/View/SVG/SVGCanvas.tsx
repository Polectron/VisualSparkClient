import React from "react";
import SVGLine from "./SVGLine";
import SVGLineProp from "../../Props/SVGLineProp";

type SVGCanvasProp = {
    lines: SVGLineProp[],
    breakSVGLine: any
}

function SVGCanvas(prop : SVGCanvasProp){

    var lines = [];
    lines = prop.lines.map(l => <SVGLine {...l}/>);

    return (
        <svg onMouseMove={(e)=>e.preventDefault()} onClick={prop.breakSVGLine} id={"svg_canvas"}>
            {lines}
        </svg>
    );
}

export default SVGCanvas;