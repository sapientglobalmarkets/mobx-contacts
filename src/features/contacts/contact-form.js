import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { action, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Field, NumberInput, ResultPanel, TextInput } from 'shared/components';

const styles = theme => ({
    root: {
        flex: 2,
        overflow: 'auto',
        padding: theme.spacing.unit
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    buttonBar: {
        marginTop: '26px'
    }
});

const FIELD_ID = 'id';
const FIELD_NAME = 'name';
const FIELD_YEARS_OF_EXPERIENCE = 'yearsOfExperience';

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
            yearsOfExperience: {
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 0,
                    lessThanOrEqualTo: 50
                }
            }
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
        const errors = this.errors;

        if (!contact) {
            return (
                <div className={classes.root}>
                    Please select a contact from the list...
                </div>
            );
        }

        return (
            <div className={classes.root}>
                <form onSubmit={this.onSubmit} className={classes.form}>
                    <Typography type="title">
                        {isNew ? 'Create Contact' : 'Edit Contact'}
                    </Typography>

                    <ResultPanel result={result} />

                    <Field
                        value={contact.id}
                        name="id"
                        label="Id"
                        error={errors.get(FIELD_ID) ? true : false}
                        helperText={
                            errors.get(FIELD_ID)
                                ? errors.get(FIELD_ID)[0]
                                : null
                        }
                        onChange={this.onIdChange}
                        disabled={isNew ? false : true}
                    >
                        {props => <TextInput {...props} margin="normal" />}
                    </Field>

                    <Field
                        value={contact.name}
                        name="name"
                        label="Name"
                        error={errors.get(FIELD_NAME) ? true : false}
                        helperText={
                            errors.get(FIELD_NAME)
                                ? errors.get(FIELD_NAME)[0]
                                : null
                        }
                        onChange={this.onNameChange}
                    >
                        {props => <TextInput {...props} margin="normal" />}
                    </Field>

                    <Field
                        value={contact.yearsOfExperience}
                        name="yearsOfExperience"
                        label="Years of Experience"
                        error={
                            errors.get(FIELD_YEARS_OF_EXPERIENCE) ? true : false
                        }
                        helperText={
                            errors.get(FIELD_YEARS_OF_EXPERIENCE)
                                ? errors.get(FIELD_YEARS_OF_EXPERIENCE)[0]
                                : null
                        }
                        onChange={this.onYearsOfExperienceChange}
                    >
                        {props => <NumberInput {...props} margin="normal" />}
                    </Field>

                    <div className={classes.buttonBar}>
                        <Button raised color="primary" type="submit">
                            Save
                        </Button>&nbsp;
                        <Button raised color="accent" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    onIdChange = value => {
        const { entity: contact } = this.props;
        contact.setId(value);
    };

    onNameChange = value => {
        const { entity: contact } = this.props;
        contact.setName(value);
    };

    // Here we do a validation on each keystroke
    @action
    onYearsOfExperienceChange = value => {
        const { entity: contact } = this.props;

        // First set the value
        contact.setYearsOfExperience(value);

        // Validate and update the error for this field only
        const localErrors = validate(contact, this.constraints) || {};
        this.errors.set(
            FIELD_YEARS_OF_EXPERIENCE,
            localErrors[FIELD_YEARS_OF_EXPERIENCE]
        );
    };

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
