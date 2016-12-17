export default class StringUtils {
    static isEmpty(str) {
        return (!str || str.trim().length === 0) ? true : false;
    }

    // If trimmed string has zero length, returns null otherwise returns trimmed string
    static sanitizedString(str) {
        if (!str) { return null; }

        const trimmedString = str.trim();
        return trimmedString.length > 0 ? trimmedString : null;
    }
}
