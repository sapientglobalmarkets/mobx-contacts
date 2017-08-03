import moment from 'moment';

export class DateTimeUtils {
    /**
     * Converts a Date object to a date only string in ISO 8601 format.
     * @param {Date} date
     * @returns {string} e.g. 2016-12-07T00:00:00.000Z returns 2016-12-07
     */
    static dateToISOString(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    /**
     * Converts a date only string in ISO 8601 format a Date object.
     * @param {string} date only string in ISO 8601 format
     * @returns {Date} e.g. 2016-12-07 returns 2016-12-07T00:00:00.000Z
     */
    static ISOStringToDate(str) {
        const mDate = moment(str, 'YYYY-MM-DD');
        return mDate.toDate();
    }
}
