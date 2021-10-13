import React from "react";
import SVGLineProp from "../../Props/SVGLineProp";

function SVGLine(prop: SVGLineProp){
    return(
        // <line stroke="#000" strokeWidth="2" x1={prop.x1} y1={prop.y1} x2={prop.x2} y2={prop.y2}></line>
        // <polyline points={`${prop.x1},${prop.y1} ${prop.x2},${prop.y2}`} fill={"none"} stroke="#000" strokeWidth={2} />
        <path d={`M${prop.x1},${prop.y1} L ${Math.abs(Math.min(prop.x1, prop.x2))+(Math.abs(prop.x1-prop.x2)/2)},${prop.y1} L ${Math.abs(Math.min(prop.x1, prop.x2))+(Math.abs(prop.x1-prop.x2)/2)},${prop.y2} L ${prop.x2},${prop.y2}`} fill={"none"} stroke="#000" strokeWidth={2} />
    );
}

export default SVGLine;