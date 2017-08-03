import React from 'react';
import Button from 'material-ui/Button';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from 'material-ui/Table';
import AddIcon from 'material-ui-icons/Add';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { BusyIndicator } from 'shared/components';

const styleSheet = createStyleSheet('Master', theme => ({
    root: {
        flex: 1,
        position: 'relative', // keeps the add button in fixed location
        padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column'
    },
    tableContainer: {
        // ensures that only the table scrolls, not the add button
        flex: 1,
        overflow: 'auto'
    },
    addButton: {
        position: 'absolute',
        top: 'auto',
        right: '30px',
        bottom: '20px'
    }
}));

@observer
class MasterBase extends React.Component {
    static propTypes = {
        columnDefs: PropTypes.array.isRequired,
        entityMap: PropTypes.object.isRequired,
        selectedEntity: PropTypes.object,
        onSelectionChanged: PropTypes.func.isRequired,
        onEntityAdd: PropTypes.func.isRequired
    };

    @computed
    get entityList() {
        const { entityMap } = this.props;
        return entityMap.isLoading ? null : entityMap.values();
    }

    render() {
        const { classes, columnDefs, selectedEntity, onEntityAdd } = this.props;
        const entityList = this.entityList;

        if (!entityList) {
            return <BusyIndicator />;
        }

        return (
            <div className={classes.root}>
                <div className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columnDefs.map(columnDef => {
                                    return (
                                        <TableCell key={columnDef.id}>
                                            {columnDef.header}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entityList.map(entity => {
                                return (
                                    <TableRow
                                        hover
                                        key={entity.id}
                                        selected={
                                            selectedEntity &&
                                            selectedEntity.id === entity.id
                                        }
                                        onClick={() =>
                                            this.onEntityClicked(entity)}
                                    >
                                        {columnDefs.map(columnDef => {
                                            return (
                                                <TableCell key={columnDef.id}>
                                                    {columnDef.cellRenderer(
                                                        entity
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                <Button
                    fab
                    color="primary"
                    className={classes.addButton}
                    onClick={onEntityAdd}
                >
                    <AddIcon />
                </Button>
            </div>
        );
    }

    onEntityClicked(selectedEntity) {
        this.props.onSelectionChanged(selectedEntity);
    }
}

export const Master = withStyles(styleSheet)(MasterBase);
