import React from 'react';
import PropTypes from 'prop-types';

export class Field extends React.Component {
    static propTypes = {
        component: PropTypes.func.isRequired,
        attr: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired
    };

    render() {
        const { component: Component, attr, errors, ...rest } = this.props;
        return (
            <Component
                error={errors.get(attr) ? true : false}
                helperText={errors.get(attr) ? errors.get(attr)[0] : null}
                {...rest}
            />
        );
    }
}
