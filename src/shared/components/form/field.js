import React from 'react';
import PropTypes from 'prop-types';

/**
 * Provides an abstraction for a form field. It specifies an interface
 * that the parent form can rely on - in the form of props. These props
 * are passed on to the child component, which must adapt to the interface.
 */
export class Field extends React.Component {
    static defaultProps = {
        value: null,
        name: null,
        label: null,
        error: false,
        helperText: null,
        visible: true,
        disabled: false,
        children: null,
        onChange: null,
        onBlur: null
    };

    // ----- Interface for the parent form -----
    // 'name' property is used when sending data in a form submission.
    // See https://stackoverflow.com/questions/1397592/difference-between-id-and-name-attributes-in-html
    // Not relevant here, but it's a best practice
    //
    // 'onChange' and 'onBlur' callbacks simply return the value, NOT the full
    // event object unlike the raw components.
    static propTypes = {
        value: PropTypes.any,
        name: PropTypes.string,
        label: PropTypes.string,
        error: PropTypes.bool,
        helperText: PropTypes.string,
        visible: PropTypes.bool,
        disabled: PropTypes.bool,
        children: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        onBlur: PropTypes.func
    };

    render() {
        const {
            value,
            name,
            label,
            error,
            helperText,
            visible,
            disabled,
            children,
            onChange,
            onBlur,
            ...rest
        } = this.props;

        if (!visible) {
            return null;
        }

        // ----- Interface to be provided by the child component -----
        const childProps = {
            value,
            name,
            label,
            error,
            helperText,
            disabled,
            onChange,
            onBlur,
            ...rest
        };

        return children(childProps);
    }
}
