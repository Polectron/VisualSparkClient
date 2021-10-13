import React from "react";

class CounterOutput extends React.Component<any, any> {
    private options: any;

    constructor(props: any) {
        super(props);

        this.state = {
            value: 0
        }
    }

    setCount = (count: number) => {
        this.setState({value: count});
    }

    clear = () => {
        this.setState({value: 0});
    }

    render() {
        return (
            <div className={"elevation"}>
                <h5>Counter {this.props.id}</h5>
                {this.state.value}
            </div>
        );
    }
}

export default CounterOutput;