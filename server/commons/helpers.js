
class Helpers {

  static roundDate(timeStamp){
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);// Minus time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;// Add timezone offset
    return new Date(timeStamp);
  }

}

module.exports = Helpers;
