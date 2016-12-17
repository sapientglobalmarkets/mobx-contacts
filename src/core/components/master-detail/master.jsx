import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import styles from './master.css';

@observer
export default class Master extends React.Component {

    static propTypes = {
        columnDefs: React.PropTypes.array.isRequired,
        entityMap: React.PropTypes.object.isRequired,
        selectedEntity: React.PropTypes.object,
        onSelectionChanged: React.PropTypes.func.isRequired,
        onEntityAdd: React.PropTypes.func.isRequired
    };

    @computed get entityList() {
        const { entityMap } = this.props;
        return entityMap.isLoading ? null : entityMap.values();
    }

    render() {
        const { columnDefs, selectedEntity, onEntityAdd } = this.props;
        let entityList = this.entityList;

        if (!entityList) {
            return (
                <div className={styles.entityList}>
                    Loading...
                </div>
            );
        }

        return (
            <div className={ styles.entityList }>

                {/** TODO: Figure out a way to set the grid height to that of the container */}
                {/** See https://github.com/callemall/material-ui/issues/5662               */}
                <Table height={'600px'} selectable={true} onRowSelection={this.onRowSelection.bind(this)}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            {
                                columnDefs.map((columnDef) => {
                                    return (
                                        <TableHeaderColumn key={columnDef.id}>{columnDef.header}</TableHeaderColumn>
                                    );
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true}>
                        {
                            entityList.map((entity) => {
                                return (
                                    <TableRow key={ entity.id } selected={ selectedEntity && selectedEntity.id === entity.id }>
                                        {
                                            columnDefs.map((columnDef) => {
                                                return (
                                                    <TableRowColumn key={columnDef.id}>{ columnDef.cellRenderer.call(this, entity) }</TableRowColumn>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>

                <FloatingActionButton className={ styles.addButton } onClick={ onEntityAdd }>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }

    onRowSelection(selectedRows) {
        const { onSelectionChanged } = this.props;
        let selectedEntity = (selectedRows.length > 0) ? this.entityList[selectedRows[0]] : null;
        onSelectionChanged(selectedEntity);
    }
}
