import React from "react";
import SVGLine from "./SVGLine";
import SVGLineProp from "../../Props/SVGLineProp";

type SVGCanvasProp = {
    lines: SVGLineProp[],
    breakSVGLine: any
}

function SVGCanvas(prop : SVGCanvasProp){

    var lines: JSX.Element[] = [];
    prop.lines.forEach((lineProp) => {
        let id = lines.length;
        lines.push(<SVGLine {...lineProp} key={"line_" + id}/>)
    })

    return (
        <svg onMouseMove={(e)=>e.preventDefault()} onClick={prop.breakSVGLine} id={"svg_canvas"}>
            {lines}
        </svg>
    );
}

export default SVGCanvas;