import React from 'react';
import 'react-tagsinput/react-tagsinput.css'
import NodeControl from "./NodeControl";
import NodeControlProps from "../../../Props/NodeControlProps";
const TagsInput = require('react-tagsinput');

class TagsControl extends NodeControl {
    constructor(props: NodeControlProps) {
        super(props);

        this.state = {
            tags: [],
            value: ""
        };
    }

    handleChange = (tags: any) => {
        this.setState({tags: tags, value: tags.join()});
    }

    render() {
        return (
            <div id={"nd_extra"}>
                <TagsInput value={this.state.tags} onChange={this.handleChange} inputProps={{placeholder: "Columnas"}}/>
            </div>
        );
    }
}

export default TagsControl;