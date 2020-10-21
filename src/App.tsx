import React from 'react';
import './App.css';
import NodeCanvas from "./View/NodeCanvas";
import NodeProps from "./Props/NodeProps";
import Source_CSV_Node from "./View/Nodes/SourceCSV";
import Filter from "./View/Nodes/Filter";
import NodeCanvasProp from "./Props/NodeCanvasProp";

function App() {
    const nodes: NodeProps[] = [
        new Source_CSV_Node(10, 10),
        new Filter(100, 80)
    ];

    let canvas: NodeCanvasProp = {nodes: nodes};

    return (
        <NodeCanvas {...canvas}/>
    );
}

export default App;
