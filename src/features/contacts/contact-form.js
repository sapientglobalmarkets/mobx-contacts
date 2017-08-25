import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { action, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Field, ResultPanel } from 'shared/components';

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
                        component={TextField}
                        value={contact.name}
                        name="name"
                        label="Name"
                        error={errors.get('name') ? true : false}
                        helperText={
                            errors.get('name') ? errors.get('name')[0] : null
                        }
                        margin="normal"
                        onChange={this.onNameChange}
                    />
                    <Field
                        component={TextField}
                        value={contact.yearsOfExperience}
                        name="yearsOfExperience"
                        label="Years of Experience"
                        error={errors.get('yearsOfExperience') ? true : false}
                        helperText={
                            errors.get('yearsOfExperience')
                                ? errors.get('yearsOfExperience')[0]
                                : null
                        }
                        margin="normal"
                        onChange={this.onYearsOfExperience}
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
            </div>
        );
    }

    onNameChange = event => {
        this.props.entity.setName(event.target.value);
    };

    onYearsOfExperience = event => {
        this.props.entity.setYearsOfExperience(event.target.value);
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
