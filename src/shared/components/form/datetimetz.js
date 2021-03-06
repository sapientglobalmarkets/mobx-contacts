/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "tzErrorText" }]*/

import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import 'moment-timezone';
import PropTypes from 'prop-types';
import { StringUtils } from 'shared/utils';
import { SelectControl } from './select-control';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'row'
    },
    dateStyle: {
        width: 140,
        marginRight: 10
    },
    timeStyle: {
        width: 100,
        marginRight: 10
    },
    tzStyle: {
        marginRight: 10
    }
};

class DateTimeTzBase extends React.Component {
    static defaultProps = {
        hideTimezone: false
    };

    static propTypes = {
        date: PropTypes.instanceOf(Date),
        timezone: PropTypes.string,
        hideTimezone: PropTypes.bool,
        label: PropTypes.string,
        errorText: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            datePart: '',
            timePart: '',
            tzErrorText: null
        };
    }

    componentDidMount() {
        const { date, timezone } = this.props;
        this.setState({
            datePart: this.computeDatePart(date, timezone),
            timePart: this.computeTimePart(date, timezone)
        });
    }

    componentWillReceiveProps(nextProps) {
        const { date, timezone } = this.props;
        const { date: nextDate, timezone: nextTimezone } = nextProps;

        let propsChanged = false;

        // Check for date change
        if (
            (date && !nextDate) ||
            (!date && nextDate) ||
            (date && nextDate && date.getTime() !== nextDate.getTime())
        ) {
            propsChanged = true;
        }

        // Check for timezone change
        if (timezone !== nextTimezone) {
            propsChanged = true;
        }

        if (propsChanged) {
            this.setState({
                datePart: this.computeDatePart(nextDate, nextTimezone),
                timePart: this.computeTimePart(nextDate, nextTimezone),
                tzErrorText: null
            });
        }
    }

    render() {
        const {
            classes,
            timezone,
            hideTimezone,
            label,
            errorText
        } = this.props;
        const { datePart, timePart, tzErrorText } = this.state;
        const tzOptions = moment.tz
            .names()
            .map(name => ({ id: name, name: name }));

        return (
            <div className={classes.root}>
                <TextField
                    value={datePart}
                    label={label}
                    error={errorText ? true : false}
                    helperText={errorText}
                    className={classes.dateStyle}
                    placeholder="YYYY-MM-DD"
                    margin="normal"
                    onChange={event => {
                        this.setState({ datePart: event.target.value });
                    }}
                    onKeyPress={this.onDateTimeKeyPress}
                    onBlur={this.onDateTimeChanged}
                />
                <TextField
                    value={timePart}
                    label="Time"
                    className={classes.timeStyle}
                    placeholder="hh:mm AM"
                    margin="normal"
                    onChange={event => {
                        this.setState({ timePart: event.target.value });
                    }}
                    onKeyPress={this.onDateTimeKeyPress}
                    onBlur={this.onDateTimeChanged}
                />
                {hideTimezone ? null : (
                    <SelectControl
                        value={timezone}
                        label="Timezone"
                        className={classes.tzStyle}
                        options={tzOptions}
                        margin="normal"
                        onChange={this.onTimezoneChanged}
                    />
                )}
            </div>
        );
    }

    onDateTimeKeyPress = event => {
        // Register date change when Enter key is pressed
        if (event.charCode === 13) {
            this.onDateTimeChanged();
        }
    };

    onDateTimeChanged = () => {
        const { timezone, onChange } = this.props;
        const { datePart, timePart } = this.state;
        onChange(this.computeDate(datePart, timePart, timezone), timezone);
    };

    onTimezoneChanged = value => {
        const { onChange } = this.props;
        const { datePart, timePart } = this.state;
        const timezone = value;

        // Validate timezone
        if (moment.tz.names().indexOf(timezone) < 0) {
            this.setState({ tzErrorText: 'Invalid timezone' });
            return;
        }

        onChange(this.computeDate(datePart, timePart, timezone), timezone);
    };

    computeDatePart(date, timezone) {
        if (!date) {
            return '';
        }

        return timezone
            ? moment(date)
                  .tz(timezone)
                  .format('YYYY-MM-DD')
            : moment(date).format('YYYY-MM-DD');
    }

    computeTimePart(date, timezone) {
        if (!date) {
            return '';
        }

        return timezone
            ? moment(date)
                  .tz(timezone)
                  .format('hh:mm A')
            : moment(date).format('hh:mm A');
    }

    computeDate(datePart, timePart, timezone) {
        if (StringUtils.isEmpty(datePart)) {
            return null;
        }

        // Note: It is crucial to call moment.tz( ) instead of moment( ).tz( ).
        // This makes sure that the moment is constructed with the correct timezone.
        return timezone
            ? moment
                  .tz(`${datePart} ${timePart}`, 'YYYY-MM-DD hh:mm A', timezone)
                  .toDate()
            : moment(`${datePart} ${timePart}`, 'YYYY-MM-DD hh:mm A').toDate();
    }

    // This validation is too strict so it is not being used currently
    isTimePartValid() {
        // Sanitize timePart
        const timePart = StringUtils.sanitizeString(this.state.timePart);
        if (!timePart) {
            return true;
        }

        // Validate if it is not empty
        // See http://stackoverflow.com/questions/33906033/regex-for-time-in-hhmm-am-pm-format
        const regEx = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/;
        return timePart.match(regEx) ? true : false;
    }
}

export const DateTimeTz = withStyles(styles)(DateTimeTzBase);
