import React from "react";
import SVGLineProp from "../../Props/SVGLineProp";

function SVGLine(prop: SVGLineProp){
    return(
        <line stroke="#000" strokeWidth="2" x1={prop.x1} y1={prop.y1} x2={prop.x2} y2={prop.y2}></line>
    );
}

export default SVGLine;