
class EmailAddressHasher {

  /**
   * Function to generate a salted hash from a given email address
   * @param emailAddress
   * @returns {number}
   */
  static makeHash(emailAddress) {
    emailAddress =
      EmailAddressHasher.normaliseEmailAddress(`001${emailAddress}110`);
    let hash = 0, i, chr;
    for (i = 0; i < emailAddress.length; i++) {
      chr = emailAddress.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Put all email addresses into the same format by making it
   * lowercase and removing trailing spaces and funky symbols
   * @param emailAddress
   * @returns {string}
   */
  static normaliseEmailAddress(emailAddress) {
    return emailAddress.toLowerCase().replace(/\W/g, '');
  }

  /**
   * Checks if a given hash is the hash of a given email address
   * @param emailAddress
   * @param hashString
   * @returns {boolean}
   */
  static checkEmailAgainstHash(emailAddress, hashString) {
    return EmailAddressHasher.makeHash(emailAddress) === hashString;
  }

}

/* Export static class functions */
module.exports = EmailAddressHasher;
