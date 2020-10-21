import OutputProp from "./OutputProp";
import NodeProps from "./NodeProps";

type InputProp = {
    type: string,
    name: string,
    connectedTo?: OutputProp,
    anchorClickCallback?: any,
    parent: any
}

export default InputProp;