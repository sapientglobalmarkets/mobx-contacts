import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';

import styles from './master-detail.css';

@observer
export default class MasterDetail extends React.Component {

    static propTypes = {
        columnDefs: React.PropTypes.array.isRequired,
        entityMap: React.PropTypes.object.isRequired,
        createEntity: React.PropTypes.func.isRequired,
        masterComponent: React.PropTypes.func.isRequired,
        detailComponent: React.PropTypes.func.isRequired
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
        let { columnDefs, entityMap } = this.props;

        return (
            <div className={ styles.masterDetail }>
                {
                    React.createElement(this.props.masterComponent, {
                        columnDefs: columnDefs,
                        entityMap: entityMap,
                        selectedEntity: this.selectedEntity,
                        onSelectionChanged: this.onSelectionChanged.bind(this),
                        onEntityAdd: this.editNewEntity.bind(this)
                    })
                }
                <div className={ styles.verticalDivider } />
                {
                    React.createElement(this.props.detailComponent, {
                        entity: this.editedEntity,
                        isNew: this.isNew,
                        result: this.result,
                        onSave: this.onSave.bind(this),
                        onCancel: this.editSelectedEntity.bind(this)
                    })
                }
            </div>
        );
    }

    @action
    onSelectionChanged(selectedEntity) {
        this.selectedEntity = selectedEntity;
        this.editSelectedEntity();
    }

    @action
    editNewEntity() {
        this.result = null;
        this.selectedEntity = null;
        this.editedEntity = this.props.createEntity();
        this.isNew = true;
    }

    @action
    editSelectedEntity() {
        this.result = null;
        if (this.selectedEntity) {
            // Clone the entity so that the original is not edited
            this.editedEntity = this.selectedEntity.clone();
            this.isNew = false;
        }
        else {
            this.editNewEntity();
        }
    }

    onSave() {
        const { entityMap } = this.props;
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
        })
        .catch((error) => {
            runInAction('onSaveFailure', () => {
                // Show error message
                this.result = error;
            });
        });
    }

}
