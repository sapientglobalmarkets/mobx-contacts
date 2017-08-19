import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { action, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { ResultPanel, ValidatedInput } from 'shared/components';

const styles = theme => ({
    root: {
        flex: 2,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.unit
    },
    addressFields: {
        display: 'flex',
        flexDirection: 'row'
    },
    street: {
        flex: 4,
        marginRight: theme.spacing.unit * 2
    },
    city: {
        flex: 2,
        marginRight: theme.spacing.unit * 2
    },
    state: {
        flex: 2,
        marginRight: theme.spacing.unit * 2
    },
    zip: {
        flex: 1
    },
    buttonBar: {
        marginTop: '26px'
    }
});

@observer
class ContactFormBase extends React.Component {
    static propTypes = {
        entity: PropTypes.object,
        entityContext: PropTypes.object,
        isNew: PropTypes.bool.isRequired,
        result: PropTypes.object,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    // Start with a blank errors object
    @observable errors = new ObservableMap();

    constructor(props) {
        super(props);
        this.constraints = {
            id: {
                presence: true,
                format: {
                    pattern: '^[a-zA-Z0-9-]+',
                    message:
                        '^Id can contain only alphanumeric characters and dashes (-)'
                }
            },
            name: {
                presence: true
            },
            company: {},
            email: {
                email: true
            },
            phone: {},
            'address.street': {
                format: {
                    pattern: '^[0-9]+ .+$',
                    message: '^The street must be a number followed by a name'
                }
            },
            'address.city': {},
            'address.state': {},
            'address.zip': {},
            birthdate: {
                datetime: {
                    dateOnly: true
                }
            },
            notes: {}
        };
    }

    @action
    componentWillReceiveProps(nextProps) {
        // If component is receiving a new entity then clear errors
        if (this.props.entity !== nextProps.entity) {
            this.errors.clear();
        }
    }

    render() {
        const {
            classes,
            entity: contact,
            isNew,
            result,
            onCancel
        } = this.props;
        const constraints = this.constraints;
        const errors = this.errors;

        if (!contact) {
            return (
                <div className={classes.root}>
                    Please select a contact from the list...
                </div>
            );
        }

        return (
            <form onSubmit={this.onSubmit} className={classes.root}>
                <Typography type="title">
                    {isNew ? 'Create Contact' : 'Edit Contact'}
                </Typography>

                <ResultPanel result={result} />

                <ValidatedInput
                    entity={contact}
                    attr="id"
                    name="id"
                    label="Id"
                    constraints={constraints}
                    errors={errors}
                    disabled={isNew ? false : true}
                    margin="normal"
                />
                <ValidatedInput
                    entity={contact}
                    attr="name"
                    name="name"
                    label="Name"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />
                <ValidatedInput
                    entity={contact}
                    attr="company"
                    name="company"
                    label="Company"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />
                <ValidatedInput
                    entity={contact}
                    attr="email"
                    name="email"
                    label="Email"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />
                <ValidatedInput
                    entity={contact}
                    attr="phone"
                    name="phone"
                    label="Phone"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />
                <div className={classes.addressFields}>
                    <ValidatedInput
                        entity={contact}
                        attr="address.street"
                        name="street"
                        label="Street"
                        constraints={constraints}
                        errors={errors}
                        margin="normal"
                        className={classes.street}
                    />
                    <ValidatedInput
                        entity={contact}
                        attr="address.city"
                        name="city"
                        label="City"
                        constraints={constraints}
                        errors={errors}
                        margin="normal"
                        className={classes.city}
                    />
                    <ValidatedInput
                        entity={contact}
                        attr="address.state"
                        name="state"
                        label="State"
                        constraints={constraints}
                        errors={errors}
                        margin="normal"
                        className={classes.state}
                    />
                    <ValidatedInput
                        entity={contact}
                        attr="address.zip"
                        name="zip"
                        label="Zip"
                        constraints={constraints}
                        errors={errors}
                        margin="normal"
                        className={classes.zip}
                    />
                </div>
                <ValidatedInput
                    entity={contact}
                    attr="birthdate"
                    name="birthdate"
                    label="Birthdate"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />
                <ValidatedInput
                    entity={contact}
                    attr="notes"
                    name="notes"
                    label="Notes"
                    constraints={constraints}
                    errors={errors}
                    margin="normal"
                />

                <div className={classes.buttonBar}>
                    <Button raised color="primary" type="submit">
                        Save
                    </Button>&nbsp;
                    <Button raised color="accent" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        );
    }

    @action
    onSubmit = event => {
        event.stopPropagation();
        event.preventDefault();

        // Do a full validation on submit
        this.errors.clear();
        const { entity: contact, onSave } = this.props;
        const localErrors = validate(contact, this.constraints);
        if (localErrors) {
            this.errors.merge(localErrors);
        } else {
            onSave();
        }
    };
}

export const ContactForm = withStyles(styles)(ContactFormBase);
