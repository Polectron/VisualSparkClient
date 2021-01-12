import React from "react";
import NodeControlProps from "../../../Props/NodeControlProps";

abstract class NodeControl extends React.Component<NodeControlProps, any> {
    public name: string;

    protected constructor(props: NodeControlProps) {
        super(props);
        this.name = props.name;
        this.state = {value: props.value};
    }

    getValue(): string {
        return this.state.value;
    }
}

export default NodeControl;