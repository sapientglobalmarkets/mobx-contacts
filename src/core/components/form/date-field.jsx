/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "constraints" }]*/

import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import DatePicker from 'material-ui/DatePicker';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import validate from 'validate.js';

@observer
export default class DateField extends React.Component {

    // All other properties are pass-through
    static propTypes = {
        entity: React.PropTypes.object.isRequired,
        attr: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        constraints: React.PropTypes.object.isRequired,
        errors: React.PropTypes.object.isRequired
    };

    static defaultProps = {
        container: 'inline',
        locale: 'en-US',
        autoOk: true
    };

    render() {
        let { entity, attr, label, constraints, errors, ...rest } = this.props;

        return (
            <DatePicker {...rest}
                value={ get(entity, attr) }
                floatingLabelText={ label }
                errorText={ errors.get(attr) ? errors.get(attr)[0] : null }
                onChange={ this.onChange.bind(this) }
                onBlur={ this.onBlur.bind(this) }
            />
        );
    }

    @action
    onChange(event, date) {
        let { entity, attr } = this.props;
        // Since attribute can be a dotted path, use lodash to set it
        set(entity, attr, date);
    }

    @action
    onBlur() {
        let { entity, attr, constraints, errors } = this.props;

        // Validate and update the error for this field only
        let localErrors = validate(entity, constraints) || {};
        errors.set(attr, localErrors[attr]);
    }
}
