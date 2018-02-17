
class Helpers {

  static roundDate(timeStamp){

    /* If timestamp is actually a Date() then convert it to timestamp */
    if (timeStamp instanceof  Date)timeStamp = timeStamp.getTime();

    /* Round, (by subtracting the time since midnight)*/
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);

    /* Add the timezone offset */
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;

    /* Convert back to date, and return */
    return new Date(timeStamp);

  }

  /**
   * Determines if a given date is today.
   * Returns true if it is, false if it isn't
    * @param date
   * @returns {boolean}
   */
  static isDateToday(date){
    const inputDate = new Date(date).setHours(0,0,0,0);
    const todaysDate = new Date().setHours(0,0,0,0);
    return inputDate === todaysDate;
  }

  /**
   * Puts a given string into uniform format by making it
   * lowercase and removing trailing spaces and funky symbols
   * @param str
   * @returns {string}
   */
  static normaliseString(str) {
    return str.toLowerCase().replace(/\W/g, '');
  }

}

module.exports = Helpers;
