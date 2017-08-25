import React from 'react';
import PropTypes from 'prop-types';

export class Field extends React.Component {
    static propTypes = {
        component: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        error: PropTypes.bool.isRequired,
        helperText: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };

    render() {
        const { component: Component, ...rest } = this.props;
        return <Component {...rest} />;
    }
}
