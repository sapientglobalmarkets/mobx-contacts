import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { action, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { ResultPanel, ValidatedNumber, ValidatedText } from 'shared/components';

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
            <div className={classes.root}>
                <form onSubmit={this.onSubmit} className={classes.form}>
                    <Typography type="title">
                        {isNew ? 'Create Contact' : 'Edit Contact'}
                    </Typography>

                    <ResultPanel result={result} />

                    <ValidatedText
                        entity={contact}
                        attr="id"
                        name="id"
                        label="Id"
                        constraints={constraints}
                        errors={errors}
                        disabled={isNew ? false : true}
                        margin="normal"
                    />

                    <ValidatedText
                        entity={contact}
                        attr="name"
                        name="name"
                        label="Name"
                        constraints={constraints}
                        errors={errors}
                        margin="normal"
                    />

                    <ValidatedNumber
                        entity={contact}
                        attr="yearsOfExperience"
                        name="yearsOfExperience"
                        label="Years of Experience"
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
            </div>
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
