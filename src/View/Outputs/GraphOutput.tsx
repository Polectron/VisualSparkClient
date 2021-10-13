import React from "react";
import { Bar, Line, Pie } from 'react-chartjs-2';

class GraphOutput extends React.Component<any, any> {
    private options: any;
    private pie_options: any;
    public datapoints: any;
    public labels: any;

    constructor(props: any) {
        super(props);

        this.datapoints = [];
        this.labels = [];

        this.state = {
            data: {
                labels: [],
                datasets: [
                    {
                        label: '',
                        data: [],
                        fill: false,
                        backgroundColor: this.getRandomColor()
                    },
                ],
            },
            type: ""
        }

        this.options = {
            legend: {
                onClick: null,
                display: false
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            datasets: {
                line: {
                    tension: 0
                }
            }
        };

        this.pie_options = {
            legend: {
                onClick: null,
                display: false
            },
            borderWidth: 0
        };
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    addDataPoint = (dataPoint: any) => {
        this.labels.push(dataPoint.x);
        this.datapoints.push(dataPoint.y);
    }

    setType = (type: string) => {
        this.setState({ type: type });
        let tmpData = { ...this.state.data };
        if (type === "piechart") {
            tmpData.datasets[0].backgroundColor = [];
        } else {
            tmpData.datasets[0].backgroundColor = this.getRandomColor();
        }

        this.setState({ data: tmpData });
    }

    clear = () => {
        let tmpData = {
            labels: [],
            datasets: [
                {
                    label: '',
                    data: [],
                    fill: false,
                    backgroundColor: this.getRandomColor()
                },
            ],
        }

        this.datapoints = [];
        this.labels = [];

        this.setState({ data: tmpData, type: "" });
    }

    redraw = () => {
        let tmpData = { ...this.state.data };
        tmpData.datasets[0].data = [...this.datapoints];
        tmpData.labels = [...this.labels];
        if (this.state.type === "piechart") {
            tmpData.datasets[0].backgroundColor = this.datapoints.map((point: any) => this.getRandomColor());
        }else{
            this.getRandomColor();
        }
        this.setState({ data: tmpData });
    }

    drawChart = () => {
        if (this.state.type === "barchart") {
            return <Bar data={this.state.data} options={this.options} />
        } else if (this.state.type === "linechart") {
            return <Line data={this.state.data} options={this.options} />
        } else if (this.state.type === "piechart") {
            return <Pie data={this.state.data} options={this.pie_options} />
        } else {
            return "No data"
        }
    }

    render() {
        return (
            <div className={"elevation"}>
                <h5>Graph {this.props.id}</h5>
                {this.drawChart()}
            </div>
        );
    }
}

export default GraphOutput;