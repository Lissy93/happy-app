import { NgModule } from '@angular/core';

@NgModule({


})
export class SharedModule {

  /**
   * Calculates the integer number of days since a given date
   * @param historicalDate
   * @returns {number}
   */
  getNumDaysFromDate(historicalDate){
    const day = 24*60*60*1000;              // The number of milliseconds in one day
    const now = new Date().getTime();       // The time right now
    const then = new Date(historicalDate).getTime();  // The time comparing to
    return Math.round((now - then) / day ); // Find difference in milliseconds, then days
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
  getOverallSentimentCount(rawData){
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
  getSentimentCountPerDay(rawData){
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

}
