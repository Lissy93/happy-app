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

}
