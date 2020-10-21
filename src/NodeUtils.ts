import NodeProps from "./Props/NodeProps";
import SVGLineProp from "./Props/SVGLineProp";
import React from "react";
import NodeTemplate from "./View/Nodes/NodeTemplate";

class NodeUtils {
    static traceLines(nodes: NodeProps[]): SVGLineProp[] {
        var tmp = [];

        tmp.push({x1: 0, y1: 0, x2: 0, y2: 0});

        return tmp;
    }
}

export default NodeUtils;