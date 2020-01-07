import React, { PureComponent } from 'react';
import { Cell, Column, Table, ColumnHeaderCell } from "@blueprintjs/table";
import { Menu, MenuItem, HTMLSelect, Button, ButtonGroup, AnchorButton, Popover } from "@blueprintjs/core";
import PopoverContent from '../popover-content';
import { dummyData } from "../../data";
import { pick } from 'lodash';

import './styles.scss';

export default class Clients extends PureComponent {

    itemsPerPage = 15;
    endRecords = this.itemsPerPage;
    selectOptions = [{ value: 15, label: '15 Records per page' }, {value: 30, label: '30 Records per page'}];
    columns = Object.keys(dummyData[0]).map(item => ({ key: item, value: item !== 'id' }));

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

    getSwitchChangeState = (e, item) => {
        this.columns = this.columns.map(col => {
            return (item.key !== col.key ? col : {...col, value: e.target.checked})
        });
        const pickBy = this.columns.reduce((acc, col) => {
            if(col.value) {
                acc = [...acc, col.key]
            }
            return acc
        }, []);
        this.setState({
            dummyData: dummyData.slice(0, this.endRecords).map(data => {
                return pick(data, pickBy)
            })
        });
    }

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
                <div className='filters-panel'>
                    <div className='filters-panel_group'>
                        <Popover
                            position='bottom'
                            content={
                                <PopoverContent
                                    items={this.columns}
                                    visibleColumns={Object.keys(this.state.dummyData[0])}
                                    getSwitchChangeState={this.getSwitchChangeState}
                                />
                            }
                        >
                            <ButtonGroup>
                                <Button alignText='right' icon='grouped-bar-chart'>Columns</Button>
                                <AnchorButton>{Object.keys(this.state.dummyData[0]).length}</AnchorButton>
                            </ButtonGroup>
                        </Popover>
                    </div>
                </div>
                <div className='table-container'>
                    <Table
                        selectionModes='NONE'
                        className='blueprint-table'
                        defaultColumnWidth={300}
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
                            icon='caret-down'
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
