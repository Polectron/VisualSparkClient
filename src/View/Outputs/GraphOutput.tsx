import React from "react";
import { Bar, Line, Pie } from 'react-chartjs-2';
import chroma from "chroma-js";

class GraphOutput extends React.Component<any, any> {
    private options: any;

    constructor(props: any) {
        super(props);

        this.state = {
            data: {
                labels: ['1', '2', '3', '4', '5', '6'],
                datasets: [
                    {
                        label: '',
                        data: [12, 19, 3, 5, 2, 3],
                        fill: false,
                        backgroundColor: chroma.scale(['#fafa6e','#2A4858']).colors(6)
                    },
                ],
            }
        }

        this.options = {
            legend: {
                onClick: null
            }
        };
    }

    addDataPoint = (dataPoint: any) => {
        const dataPoints = [...this.state.data, dataPoint];
        this.setState({ data: dataPoints });
    }

    clear = () => {
        this.setState({ data: { } });
    }

    render() {
        return (
            <div className={"elevation"}>
                <h5>Graph {this.props.id}</h5>
                <Pie data={this.state.data} options={this.options} />
            </div>
        );
    }
}

export default GraphOutput;