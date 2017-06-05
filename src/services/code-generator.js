/**
 * Generate random string code
 *
 * @returns {string}
 */
export default function generateCode() {
    var length = 6,
        charset = "abcdefghijklmnopqrstuvwxyz",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}