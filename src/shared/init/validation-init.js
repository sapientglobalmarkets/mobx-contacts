// This module should be imported once to initialize custom validators.
//
//     import 'shared/init/validation-init';
//
// Even though this import is not importing anything, it has the side-effect of initializing validate.js.

import moment from 'moment';
import validate from 'validate.js';

// JavaScript DateTime object validator
validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function(value) {
        return moment.utc(value);
    },
    // Input is a unix timestamp
    format: function(value, options) {
        const format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
    }
});
