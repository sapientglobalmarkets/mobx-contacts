/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "constraints" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import TextField from 'material-ui/TextField';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';

@observer
export class ValidatedInput extends React.Component {
    // All other properties are pass-through
    static propTypes = {
        entity: PropTypes.object.isRequired,
        attr: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        constraints: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
    };

    render() {
        const { entity, attr, label, constraints, errors, ...rest } = this.props;

        return (
            <TextField
                value={get(entity, attr)}
                label={label}
                error={errors.get(attr) ? true : false}
                onChange={this.onChange}
                onKeyPress={this.onKeyPress}
                onBlur={this.onInputChanged}
                {...rest}
            />
        );
    }

    @action
    onChange = event => {
        const { entity, attr } = this.props;
        // Since attribute can be a dotted path, use lodash to set it
        set(entity, attr, event.target.value);
    };

    onKeyPress = event => {
        // Register input change when Enter key is pressed
        if (event.charCode === 13) {
            this.onInputChanged();
        }
    };

    @action
    onInputChanged = () => {
        const { entity, attr, constraints, errors } = this.props;

        // Validate and update the error for this field only
        const localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    };
}
