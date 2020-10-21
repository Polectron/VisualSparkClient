import InputProp from "./InputProp";
import NodeProps from "./NodeProps";

type OutputProp = {
    type: string,
    name: string,
    connectedTo?: InputProp,
    anchorClickCallback?: any,
    parent: any
}

export default OutputProp;