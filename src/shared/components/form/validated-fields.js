/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "constraints" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Field } from './field';
import { NumberInput, TextInput } from './text-based-inputs';
import { SelectInput } from './select-input';

@observer
export class ValidatedField extends React.Component {
    // All other properties are pass-through
    static propTypes = {
        entity: PropTypes.object.isRequired,
        attr: PropTypes.string.isRequired,
        constraints: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired,
        children: PropTypes.func.isRequired
    };

    render() {
        const {
            entity,
            attr,
            constraints,
            errors,
            children,
            ...rest
        } = this.props;

        return (
            <Field
                value={get(entity, attr)}
                error={errors.get(attr) ? true : false}
                helperText={errors.get(attr) ? errors.get(attr)[0] : null}
                onChange={this.onChange}
                {...rest}
            >
                {children}
            </Field>
        );
    }

    @action
    onChange = value => {
        const { entity, attr, constraints, errors } = this.props;

        // First set the value
        // Since attribute can be a dotted path, use lodash for this
        set(entity, attr, value);

        // Validate and update the error for this field only
        const localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    };
}

export function ValidatedText(props) {
    return (
        <ValidatedField {...props}>
            {props => <TextInput {...props} />}
        </ValidatedField>
    );
}

export function ValidatedNumber(props) {
    return (
        <ValidatedField {...props}>
            {props => <NumberInput {...props} />}
        </ValidatedField>
    );
}

export function ValidatedSelect(props) {
    return (
        <ValidatedField {...props}>
            {props => <SelectInput {...props} />}
        </ValidatedField>
    );
}
