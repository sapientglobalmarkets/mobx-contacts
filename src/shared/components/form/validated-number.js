/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "constraints" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { NumberField } from './number-field';

@observer
export class ValidatedNumber extends React.Component {
    // All other properties are pass-through
    static propTypes = {
        entity: PropTypes.object.isRequired,
        attr: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        constraints: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
    };

    render() {
        const {
            entity,
            attr,
            label,
            constraints,
            errors,
            ...rest
        } = this.props;

        return (
            <NumberField
                num={get(entity, attr)}
                label={label}
                errorText={errors.get(attr) ? errors.get(attr)[0] : null}
                onChange={this.onChange}
                {...rest}
            />
        );
    }

    @action
    onChange = num => {
        const { entity, attr, constraints, errors } = this.props;
        // Since attribute can be a dotted path, use lodash to set it
        set(entity, attr, num);

        // Validate and update the error for this field only
        const localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    };
}
