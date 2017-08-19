import React from 'react';
import { withStyles } from 'material-ui/styles';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { VerticalDivider } from 'shared/components';

const styles = {
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
    }
};

@observer
class MasterDetailBase extends React.Component {
    static propTypes = {
        columnDefs: PropTypes.array.isRequired,
        entityMap: PropTypes.object.isRequired,
        entityContext: PropTypes.object,
        createEntity: PropTypes.func.isRequired,
        masterComponent: PropTypes.func.isRequired,
        detailComponent: PropTypes.func.isRequired,
        onSaveNew: PropTypes.func,
        onSaveExisting: PropTypes.func
    };

    @observable selectedEntity = null;

    @observable editedEntity = null;
    @observable isNew = true;

    @observable result = null;

    @action
    componentDidMount() {
        this.editedEntity = this.props.createEntity();
    }

    render() {
        const {
            classes,
            columnDefs,
            entityMap,
            entityContext,
            masterComponent,
            detailComponent
        } = this.props;

        return (
            <div className={classes.root}>
                {React.createElement(masterComponent, {
                    columnDefs: columnDefs,
                    entityMap: entityMap,
                    selectedEntity: this.selectedEntity,
                    onSelectionChanged: this.onSelectionChanged,
                    onEntityAdd: this.editNewEntity
                })}
                <VerticalDivider />
                {React.createElement(detailComponent, {
                    entity: this.editedEntity,
                    entityContext: entityContext,
                    isNew: this.isNew,
                    result: this.result,
                    onSave: this.onSave,
                    onCancel: this.editSelectedEntity
                })}
            </div>
        );
    }

    @action
    onSelectionChanged = selectedEntity => {
        this.selectedEntity = selectedEntity;
        this.editSelectedEntity();
    };

    @action
    editNewEntity = () => {
        this.result = null;
        this.selectedEntity = null;
        this.editedEntity = this.props.createEntity();
        this.isNew = true;
    };

    @action
    editSelectedEntity = () => {
        this.result = null;
        if (this.selectedEntity) {
            // Clone the entity so that the original is not edited
            this.editedEntity = this.selectedEntity.clone();
            this.isNew = false;
        } else {
            this.editNewEntity();
        }
    };

    onSave = () => {
        const { entityMap, onSaveNew, onSaveExisting } = this.props;
        entityMap
            .saveViewModel(this.editedEntity)
            .then(() => {
                runInAction('onSaveSuccess', () => {
                    // Show success message
                    this.result = {
                        code: null,
                        message: 'Entity saved'
                    };
                });

                // Bubble up to parent
                if (this.isNew) {
                    if (onSaveNew) {
                        onSaveNew(this.editedEntity);
                    }
                } else {
                    if (onSaveExisting) {
                        onSaveExisting(this.editedEntity);
                    }
                }
            })
            .catch(error => {
                runInAction('onSaveFailure', () => {
                    // Show error message
                    this.result = error;
                });
            });
    };
}

export const MasterDetail = withStyles(styles)(MasterDetailBase);
