import moment from 'moment';

export default class DateTimeUtils {

    // Converts a Date object to a date only ISO string.
    // Example: 2016-12-07T00:00:00.000Z returns 2016-12-07
    static dateToISOString(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    static ISOStringToDate(str) {
        let mDate = moment(str, 'YYYY-MM-DD');
        return mDate.toDate();
    }
}
