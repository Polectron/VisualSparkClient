import React from "react";
import NodeControl from "./NodeControl";
import NodeControlProps from "../../../Props/NodeControlProps";

class SelectControl extends NodeControl {
    private options: any;

    protected constructor(props: NodeControlProps) {
        super(props)

        this.state = {value: props.options[0]["value"]};

        this.options = props.options;
    }

    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            value: value
        });
    }

    render() {
        const o = this.options.map((x: any) => <option value={x.value}>{x.name}</option>);
        return (
            <div id={"nd_extra"}>
                <select onChange={this.handleInputChange}>
                    {o}
                </select>
            </div>
        );
    }

}

export default SelectControl;