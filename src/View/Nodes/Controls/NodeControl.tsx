import React from "react";

abstract class NodeControl extends React.Component<any, any> {
    public name: string;

    protected constructor(props: any) {
        super(props);
        this.name = props.name;
    }

    getValue(): string {
        return this.state.value;
    }
}

export default NodeControl;