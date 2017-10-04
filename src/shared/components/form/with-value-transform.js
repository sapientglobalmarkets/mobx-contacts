import React from 'react';

export function withValueTransform(Component, fromValueFn, toValueFn) {
    return class TransformedInput extends React.Component {
        render() {
            const value = fromValueFn(this.props.value);

            return (
                <Component
                    {...this.props}
                    value={value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
            );
        }

        onChange = value => {
            const changedValue = toValueFn(value);
            this.props.onChange(changedValue);
        };

        onBlur = value => {
            if (this.props.onBlur) {
                const changedValue = toValueFn(value);
                this.props.onBlur(changedValue);
            }
        };
    };
}
