import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import * as Icon from "react-feather";
import React from "react";
import Source_CSV_Node from "./Nodes/Sources/SourceCSV";
import TableNode from "./Nodes/Outputs/TableNode";
import Filter from "./Nodes/Filters/Filter";
import Aggregation from "./Nodes/Aggregations/Aggregation";
import Sum from "./Nodes/Aggregations/Sum";
import Avg from "./Nodes/Aggregations/Avg";
import Min from "./Nodes/Aggregations/Min";
import Max from "./Nodes/Aggregations/Max";
import Source_JDBC_Node from "./Nodes/Sources/SourceJDBC";
import GroupBy from "./Nodes/Aggregations/GroupBy";
import Subtract from "./Nodes/Filters/Subtract";
import Source_MongoDB_Node from "./Nodes/Sources/SourceMongoDB";

function NodeButton(props: any) {
    return <Button style={{margin: "10px"}} variant={props.class}
                   onClick={props.onClick.bind(null, props.type)}>{props.icon} {props.name}</Button>;
}

class NodesCard extends React.Component<any, any> {
    private buttons: any[];

    constructor(props: any) {
        super(props);
        this.buttons = props.buttons.map((b: any) => <NodeButton icon={b.icon} name={b.name} class={props.class}
                                                                 onClick={() => {
                                                                     props.addNode(b.data)
                                                                 }}/>);
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

        this.buttons = [
            {
                name: "Fuentes", class: "source", buttons: [{
                    icon: <Icon.File/>,
                    name: "Fuente CSV",
                    data: {newNode: () => new Source_CSV_Node(0, 0), onAdd: null}
                }, {
                    icon: <Icon.Database/>,
                    name: "Fuente JDBC",
                    data: {newNode: () => new Source_JDBC_Node(0, 0), onAdd: null}
                }, {
                    icon: <Icon.Database/>,
                    name: "Fuente MongoDB",
                    data: {newNode: () => new Source_MongoDB_Node(0, 0), onAdd: null}
                }]
            },
            {
                name: "Filtros",
                class: "filter",
                buttons: [{
                    icon: <Icon.Filter/>,
                    name: "Filtro",
                    data: {newNode: () => new Filter(0, 0), onAdd: null}
                }, {
                    icon: <Icon.Filter/>,
                    name: "Sustraer",
                    data: {newNode: () => new Subtract(0, 0), onAdd: null}
                }]
            },
            {
                name: "Agregación",
                class: "aggr",
                buttons: [
                    {
                        icon: <Icon.List/>,
                        name: "Agrupar",
                        data: {newNode: () => new GroupBy(0, 0), onAdd: null}
                    },
                    {
                        icon: <Icon.Circle/>,
                        name: "Agregación",
                        data: {newNode: () => new Aggregation(0, 0), onAdd: null}
                    }, {
                        icon: <Icon.Plus/>,
                        name: "Suma",
                        data: {newNode: () => new Sum(0, 0), onAdd: null}
                    }, {
                        icon: <Icon.Divide/>,
                        name: "Media",
                        data: {newNode: () => new Avg(0, 0), onAdd: null}
                    }, {
                        icon: <Icon.Minimize/>,
                        name: "Mínimo",
                        data: {newNode: () => new Min(0, 0), onAdd: null}
                    }, {
                        icon: <Icon.Maximize/>,
                        name: "Máximo",
                        data: {newNode: () => new Max(0, 0), onAdd: null}
                    }
                ]
            },
            {
                name: "Salidas",
                class: "output",
                buttons: [{
                    icon: <Icon.BarChart2/>,
                    name: "Tabla",
                    data: {
                        newNode: () => new TableNode(0, 0), onAdd: (id: number) => {
                            props.addTable(id)
                        }
                    }
                }]
            }
        ];

        this.buttonCards = this.buttons.map((b, id) => <NodesCard class={b.class} {...b} key={id} eventKey={`${id}`}
                                                                  addNode={props.addNode}/>);
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