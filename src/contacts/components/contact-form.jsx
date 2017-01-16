import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { action, map, observable } from 'mobx';
import { observer } from 'mobx-react';
import validate from 'validate.js';
import { ValidatedDate, ValidatedInput, ResultPanel } from 'core';

import styles from './contact-form.css';

@observer
export default class ContactForm extends React.Component {

    static propTypes = {
        entity: React.PropTypes.object,
        isNew: React.PropTypes.bool.isRequired,
        result: React.PropTypes.object,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    };

    // Start with a blank errors object
    @observable errors = map();

    constructor(props) {
        super(props);
        this.constraints = {
            id: {
                presence: true,
                format: {
                    pattern: '^[a-zA-Z0-9-]+',
                    message: '^Id can contain only alphanumeric characters and dashes (-)'
                }
            },
            name: {
                presence: true
            },
            company: {
            },
            email: {
                email: true
            },
            phone: {
            },
            'address.street': {
                format: {
                    pattern: '^[0-9]+ .+$',
                    message: '^The street must be a number followed by a name'
                }
            },
            'address.city': {
            },
            'address.state': {
            },
            'address.zip': {
            },
            birthdate: {
            },
            notes: {
            }
        };
    }

    @action
    componentWillReceiveProps(nextProps) {
        // If componenent is receiving a new entity then clear errors
        if (this.props.entity !== nextProps.entity) {
            this.errors.clear();
        }
    }

    render() {
        const { entity: contact, isNew, result, onCancel } = this.props;
        let constraints = this.constraints;
        let errors = this.errors;

        if (!contact) {
            return (
                <div className={styles.contactForm}>
                    Please select an item from the list...
                </div>
            );
        }

        return (
            <form onSubmit={ this.onSubmit.bind(this) } className={ styles.contactForm }>

                <div className="md-title">
                    { isNew ? 'Create Contact' : 'Edit Contact' }
                </div>

                <ResultPanel result={ result } />

                <ValidatedInput entity={contact} attr='id' label='Contact Id' constraints={constraints} errors={errors} fullWidth={true} disabled={isNew ? false : true} />
                <ValidatedInput entity={contact} attr='name' label='Name' constraints={constraints} errors={errors} fullWidth={true} />
                <ValidatedInput entity={contact} attr='company' label='Company' constraints={constraints} errors={errors} fullWidth={true} />
                <ValidatedInput entity={contact} attr='email' label='Email' constraints={constraints} errors={errors} fullWidth={true} />
                <ValidatedInput entity={contact} attr='phone' label='Phone' constraints={constraints} errors={errors} fullWidth={true} />
                <div className={styles.addressFields}>
                    <ValidatedInput entity={contact} attr="address.street" label="Street" constraints={constraints} errors={errors} style={{ flex: 4 }} />
                    <ValidatedInput entity={contact} attr="address.city" label="City" constraints={constraints} errors={errors} style={{ flex: 2 }} />
                    <ValidatedInput entity={contact} attr="address.state" label="State" constraints={constraints} errors={errors} style={{ flex: 2 }} />
                    <ValidatedInput entity={contact} attr="address.zip" label="Zip" constraints={constraints} errors={errors} style={{ flex: 1 }} />
                </div>
                <ValidatedDate entity={contact} attr='birthdate' label='Birthdate' constraints={constraints} errors={errors} fullWidth={true} />
                <ValidatedInput entity={contact} attr='notes' label='Notes' constraints={constraints} errors={errors} fullWidth={true} />

                <div className={ styles.buttonBar }>
                    <RaisedButton label="Save" primary={true} type="submit" />&nbsp;
                    <RaisedButton label="Cancel" secondary={true} onClick={onCancel} />
                </div>

            </form>
        );
    }

    @action
    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();

        // Do a full validation on submit
        this.errors.clear();
        const { entity: contact, onSave } = this.props;
        let localErrors = validate(contact, this.constraints);
        if (localErrors) {
            this.errors.merge(localErrors);
        }
        else {
            onSave();
        }
    }
}
