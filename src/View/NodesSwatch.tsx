import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import * as Icon from "react-feather";
import React from "react";
import Accordion from "react-bootstrap/Accordion";

function NodeButton(props: any) {
    return <Button style={{ margin: "10px" }} variant={props.class}
        onClick={props.onClick.bind(null, props.type)}>{props.icon} {props.name}</Button>;
}

class NodesCard extends React.Component<any, any> {
    private readonly buttons: any[];

    constructor(props: any) {
        super(props);
        this.buttons = props.buttons.map((b: any) => <NodeButton key={b.name} icon={b.icon} name={b.name} class={props.class}
            onClick={() => {
                props.addNode(props.buildNode(b.type, 0, 0));
            }} />);
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
    private readonly buttonCards: any[];

    constructor(props: any) {
        super(props);

        this.buttons = [
            {
                name: "Fuentes", class: "source", buttons: [{
                    icon: <Icon.File />,
                    name: "Fuente CSV",
                    type: "csvsource"
                }, {
                    icon: <Icon.Database />,
                    name: "Fuente JDBC",
                    type: "jdbcsource"
                }, {
                    icon: <Icon.Database />,
                    name: "Fuente MongoDB",
                    type: "mongodbsource"
                }]
            },
            {
                name: "Filtros",
                class: "filter",
                buttons: [
                    {
                        icon: <Icon.Filter />,
                        name: "Filtro",
                        type: "filter"
                    }, {
                        icon: <Icon.Crosshair />,
                        name: "Seleccionar",
                        type: "select"
                    }, {
                        icon: <Icon.Crop />,
                        name: "Límite",
                        type: "limit"
                    }, {
                        icon: <Icon.Minus />,
                        name: "Sustraer",
                        type: "subtraction"
                    }, {
                        icon: <Icon.PieChart />,
                        name: "Muestra",
                        type: "sample"
                    }
                ]
            },
            {
                name: "Agregación",
                class: "aggr",
                buttons: [
                    {
                        icon: <Icon.List />,
                        name: "Agrupar",
                        type: "groupby"
                    },
                    {
                        icon: <Icon.Circle />,
                        name: "Agregación",
                        type: "aggregation"
                    }, {
                        icon: <Icon.Plus />,
                        name: "Contar",
                        type: "count"
                    }, {
                        icon: <Icon.Plus />,
                        name: "Suma",
                        type: "sum"
                    }, {
                        icon: <Icon.Divide />,
                        name: "Media",
                        type: "avg"
                    }, {
                        icon: <Icon.Minimize />,
                        name: "Mínimo",
                        type: "min"
                    }, {
                        icon: <Icon.Maximize />,
                        name: "Máximo",
                        type: "max"
                    }
                ]
            },
            {
                name: "Salidas",
                class: "output",
                buttons: [
                    {
                        icon: <Icon.Columns />,
                        name: "Tabla",
                        type: "table"
                    },
                    {
                        icon: <Icon.Map />,
                        name: "Mapa",
                        type: "map"
                    },
                    {
                        icon: <Icon.BarChart2 />,
                        name: "Gráficas",
                        type: "graph"
                    },
                    {
                        icon: <Icon.Hash />,
                        name: "Contador",
                        type: "counter"
                    }
                ]
            }
        ];

        this.buttonCards = this.buttons.map((b, id) => <NodesCard class={b.class} {...b} key={id} eventKey={`${id}`}
            addNode={props.addNode} buildNode={props.buildNode} />);
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