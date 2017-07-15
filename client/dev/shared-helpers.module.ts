import { NgModule } from '@angular/core';

@NgModule({


})
export class SharedModule {

  /**
   * Calculates the integer number of days since a given date
   * @param historicalDate
   * @returns {number}
   */
  static getNumDaysFromDate(historicalDate){
    const day = 24*60*60*1000;              // The number of milliseconds in one day
    const now = new Date().getTime();       // The time right now
    const then = new Date(historicalDate).getTime();  // The time comparing to
    return Math.round((now - then) / day ); // Find difference in milliseconds, then days
  }


  /**
   * Returns the numeric value for string sentiment labels, specified in config
   * @param label
   * @returns {number}
   */
  static convertLabelToValue(label){
    // TODO: These labels and values should be read from a config file
    switch(label) {
      case 'good': { return 1; }
      case 'average': { return 0; }
      case 'bad': { return -1; }
      default: { return 0; }
    }
  }


  /**
   * Returns the string sentiment label, for given numeric val, specified in config
   * @param value
   * @returns {string}
   */
  static convertValueToLabel(value){
    // TODO: These labels and values should be read from a config file
    switch(value) {
      case 1: { return 'good'; }
      case 0: { return 'average'; }
      case -1: { return 'bad'; }
      default: { return 'average'; }
    }
  }

  /**
   *
   * @param userResults
   * @returns {number}
   */
  static findAverageFromUserResults(userResults){
    let totalScore = 0;
    userResults.forEach((userResult)=>{
      totalScore += this.convertLabelToValue(userResult.score);
    });
    return totalScore / userResults.length;
  }


  /**
   * Rounds the date to nearest day
   * gets rid of second/ minute/ hour data - allows dates to be compared
   * @param date
   * @returns {date}
   */
  static roundDate(date){
    date = new Date(date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  /**
   * Gets rid of team data, all user results sorted by date instead
   * @param rawData
   * @returns {{}}
   */
  static combineTeamData(rawData){
    let results = {};
    rawData.forEach((team)=>{
      team.data.forEach((dateSet)=>{
        const date = this.roundDate(dateSet.date);
        if(results[date]){ results[date].concat(dateSet.userResults); }
        else{ results[date] = dateSet.userResults; }
      });
    });
    return results;
  }


  /**
   * Returns a string array of each sentiment
   * @param rawData
   * @returns {Array<string>} e.g. ['good', 'average', 'bad']
   */
  getAllLabels(rawData){
    let labels: Array<string> = [];
    rawData.data.forEach((dateSet)=> {
      dateSet.userResults.forEach((userResult) => {
        if(!labels.includes(userResult.score)) labels.push(userResult.score);
      });
    });
    return labels;
  }

  /**
   * Calculates overall number of results in each category, from the raw data
   * @param rawData
   * @returns { bad: 184, average: 177, good: 189 }
   */
  public getOverallSentimentCount(rawData){
    let sentimentCount = {};
    const dateCountData = this.getSentimentCountPerDay(rawData);
    Object.keys(dateCountData).forEach((date)=>{
        Object.keys(dateCountData[date]).forEach((sentimentName)=>{
          if(!sentimentCount[sentimentName]){  sentimentCount[sentimentName] = 1; }
          else{ sentimentCount[sentimentName] += dateCountData[date][sentimentName]; }
        });
    });
    return sentimentCount;
  }

  /**
   * Generates an object of dates, with a summary assigned to each
   * @param rawData
   * @returns {Array} of objects, each with a key as date, and a summary as value
   */
  public getSentimentCountPerDay(rawData){
    let results = [];
    rawData.data.forEach((dateSet)=>{
      let date = dateSet.date;
      let sentimentCount = {};
      dateSet.userResults.forEach((userResult)=>{
        let sentiment = userResult.score;
        if(sentimentCount[sentiment]){sentimentCount[sentiment]++}
        else{sentimentCount[sentiment] = 1}
      });
      results[date] = sentimentCount  ;
    });
    return results;
  }

  /**
   * Generates a list of average sentiments, for each given date
   * @param rawData
   * @returns {Array}
   */
  static getAverageDaySentiment(rawData){
    const combinedTeamData = this.combineTeamData(rawData);
    let results = [];
    Object.keys(combinedTeamData).forEach((date)=>{
        results.push({
          date: date,
          count: this.findAverageFromUserResults(combinedTeamData[date])
        })
    });
    return results;
  }

  /**
   * Given the raw score, returns percentage happiness (0-100%)
   * @param score
   * @returns {number}
   */
  public static getPercentagePositive(score){
    return Math.round((score+1)*100/2);
  }


  public showLastXDays(rawData, xDays){
    // Determines if given timestamp was since midnight, today
    function isWithinRange(then, range){
      return SharedModule.getNumDaysFromDate(then) <= range;
    }
    let newUserData = [];
    rawData.data.forEach((dateSet)=>{
      if(isWithinRange(dateSet.date, xDays)){
        newUserData.push(dateSet)
      }
    });
    let newRawData = JSON.parse(JSON.stringify(rawData));
    newRawData.data = newUserData;

    return newRawData;
  }

}
