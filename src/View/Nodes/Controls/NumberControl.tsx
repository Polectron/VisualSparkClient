import React from "react";
import NodeControlProps from "../../../Props/NodeControlProps";
import NodeControl from "./NodeControl";

class NumberControl extends NodeControl {
    private min: any;
    private max: any;

    protected constructor(props: NodeControlProps) {
        super(props);
        this.min = props.min;
        this.max = props.max;
    }

    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : parseInt(target.value);
        this.setState({
            value: value
        });
    }

    render() {
        return (
            <div id={"nd_extra"}>
                <input type={"number"} value={this.state.value} onChange={this.handleInputChange} placeholder={this.name} min={this.min} max={this.max}/>
            </div>
        );
    }

}

export default NumberControl;