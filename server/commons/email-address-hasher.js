
class EmailAddressHasher{

  /**
   * Function to generate a salted hash from a given email address
   * @param emailAddress
   * @returns {number}
   */
  static makeHash(emailAddress){
    emailAddress = `001${emailAddress}110`;
    let hash = 0, i, chr;
    for (i = 0; i < emailAddress.length; i++) {
      chr   = emailAddress.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

}



module.exports = EmailAddressHasher.makeHash;
