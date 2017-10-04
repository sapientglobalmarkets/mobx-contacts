/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[onChange|onBlur]" }]*/

import React from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

import { withValueTransform } from './with-value-transform';

class RawTextInput extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    };

    render() {
        const { onChange, onBlur, ...rest } = this.props;

        return (
            <TextField
                onChange={this.onChange}
                onBlur={this.onBlur}
                {...rest}
            />
        );
    }

    onChange = event => {
        const value = event.target.value;
        this.props.onChange(value);
    };

    onBlur = event => {
        const value = event.target.value;
        this.props.onBlur(value);
    };
}

export const TextInput = withValueTransform(
    RawTextInput,
    value => (value == null ? '' : String(value)),
    value => (value === '' ? null : value)
);

export const NumberInput = withValueTransform(
    RawTextInput,
    value => (value == null ? '' : String(value)),
    value => (value === '' ? null : Number(value))
);
