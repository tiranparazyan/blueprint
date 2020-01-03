import React, { PureComponent } from 'react';
import {Cell, Column, Table, ColumnHeaderCell} from "@blueprintjs/table";
import { dummyData } from "../../data";
import {Menu, MenuItem, HTMLSelect, Button} from "@blueprintjs/core";

import './styles.scss';

export default class Clients extends PureComponent {

    itemsPerPage = 15;
    endRecords = this.itemsPerPage;
    selectOptions = [{ value: 15, label: '15 Records per page' }, {value: 30, label: '30 Records per page'}];

    state = {
        dummyData: dummyData.slice(0, this.itemsPerPage).map(data => {
            const { id, ...rest } = data;
            return rest;
        })
    };

    sortColumns = (columnname, order) => {
        this.setState({
            dummyData: [...this.state.dummyData].sort((prev, curr) => {
                if(order === 'asc') {
                    return prev[columnname] > curr[columnname] ? 1 : prev[columnname] === curr[columnname] ? 0 : -1
                } else {
                    return prev[columnname] < curr[columnname] ? 1 : prev[columnname] === curr[columnname] ? 0 : -1
                }

            })
        })
    };

    renderColumns = () => {
        const columns = [];
        Object.keys(this.state.dummyData[0]).forEach(columnname => {

            const menuRenderer = columnIndex => {
                return (
                    <Menu>
                        <MenuItem icon="sort-asc" text="Sort Asc" onClick={() => this.sortColumns(columnname, 'asc')} />
                        <MenuItem icon="sort-desc" text="Sort Desc" onClick={() => this.sortColumns(columnname, 'desc')} />
                    </Menu>
                );
            };

            const columnHeaderCellRenderer = () => (
                <ColumnHeaderCell className='header-cell' name={columnname} menuRenderer={menuRenderer}  />
            );


            columns.push(
                <Column
                    className='blueprint-column'
                    key={columnname}
                    name={columnname}
                    columnHeaderCellRenderer={columnHeaderCellRenderer}
                    cellRenderer={this.renderCell}
                />
            );
        });

        return columns;
    };

    renderCell = (rowIndex, columnIndex) => {
        const rowData = this.state.dummyData[rowIndex];
        console.log(this.state.dummyData)
        const keyNameOfCurrentColumn = Object.keys(rowData)[columnIndex];
        const valueOfCurrentColumn = rowData[keyNameOfCurrentColumn];

        return <Cell className='table-cell'>{valueOfCurrentColumn}</Cell>;
    };

    changeHandler = (e) => {
        this.itemsPerPage = Number(e.target.value);
        this.endRecords = this.itemsPerPage;
        this.setState({
            dummyData: dummyData.slice(0, this.endRecords).map(data => {
                const { id, ...rest } = data;
                return rest;
            })
        })
    };

    loadMoreHandler = () => {
        this.endRecords = this.itemsPerPage + this.endRecords > dummyData.length ? dummyData.length : this.itemsPerPage + this.endRecords;
        this.setState({
            dummyData: dummyData.slice(
                0,
                this.endRecords
            ).map(data => {
                const { id, ...rest } = data;
                return rest;
            })
        })
    };

    render() {
        return (
            <div className='clients-container'>
                <h2>Clients</h2>
                <div className='table-container'>
                    <Table
                        selectionModes='NONE'
                        className='blueprint-table'
                        defaultColumnWidth={400}
                        defaultRowHeight={35}
                        numRows={this.state.dummyData.length}
                        enableColumnResizing={false}
                        enableMultipleSelection={false}
                        enableRowHeader={false}
                        enableRowResizing={false}
                    >
                        {
                            this.renderColumns()
                        }
                    </Table>
                </div>
                <div className="paging-container">
                    <div>
                        <HTMLSelect
                            className='blueprint-select'
                            options={this.selectOptions}
                            onChange={this.changeHandler}
                        />
                    </div>
                    <div className='info-group'>
                        <div>
                            1 - {this.endRecords > dummyData.length || this.itemsPerPage > dummyData.length ? dummyData.length : this.endRecords} of
                            {dummyData.length}
                        </div>
                        <Button className='blueprint-button' onClick={this.loadMoreHandler}>Load More</Button>
                    </div>
                </div>
            </div>
        )
    }

}
