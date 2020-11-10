import React from "react";
import NodeControl from "./NodeControl";

class TextControl extends NodeControl {

    constructor(props: any) {
        super(props);
        this.state = {value: "Test value"};
    }

    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            value: value
        });
    }

    render() {
        return (
            <div id={"nd_extra"}>
                <input type={"text"} onChange={this.handleInputChange}/>
            </div>
        );
    }

}

export default TextControl;