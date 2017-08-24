/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[num|onChange]" }]*/

import React from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import { StringUtils } from 'shared/utils';

export class NumberField extends React.Component {
    static propTypes = {
        num: PropTypes.number,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            numStr: ''
        };
    }

    componentDidMount() {
        const { num } = this.props;
        this.setState({
            numStr: this.computeNumStr(num)
        });
    }

    componentWillReceiveProps(nextProps) {
        const { num } = this.props;
        const { num: nextNum } = nextProps;

        if (num !== nextNum) {
            this.setState({
                numStr: this.computeNumStr(nextNum)
            });
        }
    }

    render() {
        const { errorText, num, onChange, ...rest } = this.props;
        const { numStr } = this.state;

        return (
            <TextField
                type="number"
                value={numStr}
                error={errorText ? true : false}
                helperText={errorText ? errorText : null}
                onChange={event => {
                    this.setState({ numStr: event.target.value });
                }}
                onKeyPress={this.onKeyPress}
                onBlur={this.onNumberChanged}
                {...rest}
            />
        );
    }

    onKeyPress = event => {
        // Register number change when Enter key is pressed
        if (event.charCode === 13) {
            this.onNumberChanged();
        }
    };

    onNumberChanged = () => {
        const { onChange } = this.props;
        const { numStr } = this.state;
        onChange(this.computeNumber(numStr));
    };

    computeNumStr(num) {
        return num ? num.toString() : '';
    }

    computeNumber(numStr) {
        return StringUtils.isEmpty(numStr) ? null : parseFloat(numStr);
    }
}
