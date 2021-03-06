/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[onChange|onBlur]" }]*/

import React from 'react';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import PropTypes from 'prop-types';
import { withValueTransform } from './with-value-transform';

class RawSelectControl extends React.Component {
    static propTypes = {
        label: PropTypes.string,
        error: PropTypes.bool,
        helperText: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        optionIdAttr: PropTypes.string,
        optionNameAttr: PropTypes.string,
        isNullable: PropTypes.bool,
        nullOptionName: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        optionIdAttr: 'id',
        optionNameAttr: 'name',
        isNullable: false,
        nullOptionName: 'None'
    };

    render() {
        const {
            className,
            label,
            error,
            helperText,
            options,
            optionIdAttr,
            optionNameAttr,
            isNullable,
            nullOptionName,
            disabled,
            margin,
            onChange,
            ...rest
        } = this.props;

        return (
            <FormControl
                className={className}
                error={error}
                disabled={disabled}
                margin={margin}
            >
                {label ? (
                    <InputLabel error={error} disabled={disabled}>
                        {label}
                    </InputLabel>
                ) : null}
                <Select onChange={this.onChange} input={<Input />} {...rest}>
                    {isNullable ? (
                        <MenuItem value="">{nullOptionName}</MenuItem>
                    ) : null}
                    {options.map(option => (
                        <MenuItem
                            key={option[optionIdAttr]}
                            value={option[optionIdAttr]}
                        >
                            {option[optionNameAttr]}
                        </MenuItem>
                    ))}
                </Select>
                {helperText ? (
                    <FormHelperText error={error} disabled={disabled}>
                        {helperText}
                    </FormHelperText>
                ) : null}
            </FormControl>
        );
    }

    onChange = event => {
        const value = event.target.value;
        this.props.onChange(value);
    };
}

export const SelectControl = withValueTransform(
    RawSelectControl,
    value => (value == null ? '' : String(value)),
    value => (value === '' ? null : value)
);
