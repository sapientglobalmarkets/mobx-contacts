/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[onChange|onBlur]" }]*/

import React from 'react';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { withValueTransform } from './with-value-transform';

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 2
    }
});

class RawSelectControlBase extends React.Component {
    static propTypes = {
        label: PropTypes.string,
        error: PropTypes.bool,
        helperText: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        optionIdAttr: PropTypes.string,
        optionNameAttr: PropTypes.string,
        isNullable: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        optionIdAttr: 'id',
        optionNameAttr: 'name',
        isNullable: false
    };

    render() {
        const {
            classes,
            label,
            error,
            helperText,
            options,
            optionIdAttr,
            optionNameAttr,
            isNullable,
            onChange,
            ...rest
        } = this.props;

        return (
            <FormControl className={classes.root} error={error}>
                <InputLabel>{label}</InputLabel>
                <Select onChange={this.onChange} input={<Input />} {...rest}>
                    {isNullable ? (
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
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
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }

    onChange = event => {
        const value = event.target.value;
        this.props.onChange(value);
    };
}

const RawSelectControl = withStyles(styles)(RawSelectControlBase);

export const SelectControl = withValueTransform(
    RawSelectControl,
    value => (value == null ? '' : String(value)),
    value => (value === '' ? null : value)
);
