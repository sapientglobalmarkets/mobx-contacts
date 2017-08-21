/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[constraints|errors]" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import InputLabel from 'material-ui/Input/InputLabel';
import { withStyles } from 'material-ui/styles';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import validate from 'validate.js';

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        marginBottom: 4
    }
});

@observer
class ValidatedSelectBase extends React.Component {
    // All other properties are pass-through
    static propTypes = {
        entity: PropTypes.object.isRequired,
        attr: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        optionIdAttr: PropTypes.string,
        optionNameAttr: PropTypes.string,
        isNullable: PropTypes.bool,
        constraints: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
    };

    static defaultProps = {
        optionIdAttr: 'id',
        optionNameAttr: 'name',
        isNullable: false
    };

    render() {
        const {
            classes,
            entity,
            attr,
            label,
            options,
            optionIdAttr,
            optionNameAttr,
            isNullable,
            constraints,
            errors,
            ...rest
        } = this.props;

        return (
            <div className={classes.root}>
                <InputLabel shrink className={classes.label}>
                    {label}
                </InputLabel>
                <Select
                    value={get(entity, attr)}
                    options={options}
                    valueKey={optionIdAttr}
                    labelKey={optionNameAttr}
                    autoBlur={true}
                    autosize={true}
                    clearable={isNullable}
                    onChange={this.onChange}
                    {...rest}
                />
            </div>
        );
    }

    @action
    onChange = option => {
        const { entity, attr, constraints, optionIdAttr, errors } = this.props;
        // Since attribute can be a dotted path, use lodash to set it
        set(entity, attr, option ? option[optionIdAttr] : null);

        // Validate and update the error for this field only
        const localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    };
}

export const ValidatedSelect = withStyles(styles)(ValidatedSelectBase);
