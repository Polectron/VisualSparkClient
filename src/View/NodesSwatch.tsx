import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import * as Icon from "react-feather";
import React from "react";
import Source_CSV_Node from "./Nodes/SourceCSV";
import TableNode from "./Nodes/TableNode";

function NodeButton(props: any) {
    return <Button style={{margin: "10px"}} variant={props.class}
                   onClick={props.onClick.bind(null, props.type)}>{props.icon} {props.name}</Button>;
}

class NodesCard extends React.Component<any, any> {
    private buttons: any[];

    constructor(props: any) {
        super(props);
        this.buttons = props.buttons.map((b: any) => <NodeButton icon={b.icon} name={b.name} class={props.class}
                                                                 onClick={()=>{props.addNode(b.data)}}/>);
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={this.props.eventKey}>
                        {this.props.name}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={this.props.eventKey}>
                    <Card.Body>
                        {this.buttons}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}

class NodesSwatch extends React.Component<any, any> {
    private buttons: any[];
    private buttonCards: any[];

    constructor(props: any) {
        super(props);

        // case "Filter":
        //     node = new Filter(0, 0);
        //     break;
        // case "Substract":
        //     node = new Subtract(0, 0);
        //     break;
        // case "Source_CSV_Node":
        //     node = new Source_CSV_Node(0, 0);
        //     break;
        // case "Aggr":
        //     node = new Aggregation(0, 0);
        //     break;
        // case "Table":
        //     node = new TableNode(0, 0);
        //     break;
        // default:
        //     node = new Filter(0, 0);

        this.buttons = [
            {
                name: "Fuentes", class: "source", buttons: [{
                    icon: <Icon.File/>, name: "Fuente CSV", data: {node: new Source_CSV_Node(0, 0), onAdd: null}
                }, {
                    icon: <Icon.Database/>, name: "Fuente JDBC", data: {node: null, onAdd: null}
                }]
            },
            {name: "Filtros", class: "filter", buttons: [{icon: <Icon.Filter/>, name: "Filtro"}]},
            {name: "Agregación", class: "aggr", buttons: [{icon: <Icon.PlusCircle/>, name: "Agregación", action: () => {console.log("Aggr")}}]},
            {name: "Salidas", class: "output", buttons: [{icon: <Icon.BarChart2/>, name: "Tabla", data: {node: new TableNode(0, 0), onAdd: (id: number) => {props.addOutput(id)}}}]}
        ];

        this.buttonCards = this.buttons.map((b, id) => <NodesCard class={b.class} {...b} key={id} eventKey={`${id}`} addNode={props.addNode}/>);
    }


    render() {
        return (
            <Accordion defaultActiveKey="0">
                {this.buttonCards}
            </Accordion>
        )
    }
}

export default NodesSwatch;