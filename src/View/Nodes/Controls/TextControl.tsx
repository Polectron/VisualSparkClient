import React from "react";
import NodeControl from "./NodeControl";

class TextControl extends NodeControl {

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
                <input type={"text"} value={this.state.value} onChange={this.handleInputChange} placeholder={this.name}/>
            </div>
        );
    }

}

export default TextControl;