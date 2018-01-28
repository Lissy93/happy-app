
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

}

module.exports = Helpers;
