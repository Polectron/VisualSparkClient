import React from 'react';
import './App.css';
import NodeCanvas from "./View/NodeCanvas";
import NodeProps from "./Props/NodeProp";
import NodeCanvasProp from "./Props/NodeCanvasProp";

function App() {
    const nodes: NodeProps[] = [];

    let canvas: NodeCanvasProp = {nodes: nodes};

    return (
        <NodeCanvas {...canvas}/>
    );
}

export default App;
