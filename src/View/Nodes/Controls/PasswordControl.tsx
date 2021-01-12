import React from "react";
import NodeControl from "./NodeControl";

class PasswordControl extends NodeControl {

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
                <input type={"password"} value={this.state.value} onChange={this.handleInputChange} placeholder={this.name}/>
            </div>
        );
    }

}

export default PasswordControl;