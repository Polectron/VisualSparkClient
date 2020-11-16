import React from "react";
import MUIDataTable from "mui-datatables";

class TableOutput extends React.Component<any, any> {
    private options: any;

    constructor(props: any) {
        super(props);

        this.options = {
            filter: false,
            selectableRows: "none",
            print: false,
            search: false,
            viewColumns: false
        };

        this.state = {
            columns: props.columns,
            rows: props.data
        }
    }

    addColumn = (column: string) => {
        let temp = [...this.state.columns];
        temp.push(column);
        this.setState({columns: temp});
    };

    addRows = (rows: any[]) => {
        let temp = [...this.state.rows];
        temp.push(...rows);
        this.setState({rows: temp});
    };

    clear = () => {
        this.setState({columns: [], rows: []});
    }

    render() {
        return (
            <div style={{margin: "15px 0px"}}>
                <MUIDataTable
                    title={`Table Output ${this.props.id}`}
                    data={this.state.rows}
                    columns={this.state.columns}
                    options={this.options}
                />
            </div>
        );
    }
}

export default TableOutput;