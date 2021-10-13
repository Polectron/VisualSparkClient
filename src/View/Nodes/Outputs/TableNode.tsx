import NodeProp from "../../../Props/NodeProp";
import AnchorProp from "../../../Props/AnchorProp";
import NodeCanvas from "../../NodeCanvas";
import React from "react";
import TableOutput from "../../Outputs/TableOutput";

class TableNode extends NodeProp {
    constructor(x: number, y: number) {
        super(x, y, "Tabla", "table", "output");
        this.inputs = [new AnchorProp("input", ["output"], "DataFrame", this)];
        this.onDelete = (canvas: NodeCanvas) => {canvas.deleteOutput(this.index)};
    }

    buildOutput = () => {
        this.outputRef = React.createRef();
        return <TableOutput ref={this.outputRef} columns={[]} data={[]} id={this.index} />
    }

    loadData = (data: any) => {
        let table: TableOutput = this.outputRef.current;
        let columns: any = new Set();

        data["data"].forEach((d: any) => {
            Object.keys(d).forEach((k) => {
                columns.add(k);
            });
        })

        columns.forEach((c: string) => {
            table.addColumn(c)
        });

        let flat_data: any = [];

        data["data"].forEach((x: any) => {
            var tmp: any = {};
            Object.keys(x).forEach((y: any) => {
                if (typeof x[y] === 'object' || typeof x[y] === 'boolean') {
                    tmp[y] = JSON.stringify(x[y]);
                } else {
                    tmp[y] = x[y];
                }
            });
            flat_data.push(tmp);
        });

        table.addRows(flat_data);
    }
}

export default TableNode;