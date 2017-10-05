/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[millis|onChange]" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { DateTimeTz } from './datetimetz';

@observer
export class ValidatedDateTime extends React.Component {
    // All other properties are pass-through
    static propTypes = {
        entity: PropTypes.object.isRequired,
        attr: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        timezone: PropTypes.string,
        constraints: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
    };

    render() {
        const {
            entity,
            attr,
            label,
            timezone,
            constraints,
            errors,
            ...rest
        } = this.props;

        return (
            <DateTimeTz
                date={get(entity, attr)}
                timezone={timezone}
                hideTimezone={true}
                label={label}
                error={errors.get(attr) ? true : false}
                helperText={errors.get(attr) ? errors.get(attr)[0] : null}
                onChange={this.onChange}
                {...rest}
            />
        );
    }

    @action
    onChange = date => {
        const { entity, attr, constraints, errors } = this.props;
        // Since attribute can be a dotted path, use lodash to set it
        set(entity, attr, date);

        // Validate and update the error for this field only
        const localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    };
}
