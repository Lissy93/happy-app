import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class CommonService {
  private notify = new Subject<any>();
  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  constructor(){}

  /**
   * Called when one of the date-squares on the grid or calendar is tapped
   * Listened at, by components that show more details for date, like DayBreakdownComponent
   * @param date
   */
  public notifyDateSquareClicked(date: Date) {
    if (date) { this.notify.next(date); }
  }

}
