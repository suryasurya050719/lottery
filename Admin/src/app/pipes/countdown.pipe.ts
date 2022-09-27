import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {

    /**
     * Gets the millisecond difference between a future date and now
     * @private
     * @param   futureDate: string
     * @returns number  milliseconds remaining
     */
    private getMsDiff = (futureDate: string): number => (+(new Date(futureDate)) - Date.now());

    /**
     * Converts milliseconds to the
     *
     * @private
     * @param msRemaining
     * @returns null    when no time is remaining
     *          string  in the format `HH:mm:ss`
     */
    private msToTime(msRemaining: number): string | null {
        if (msRemaining < 0) {
            console.info('No Time Remaining:', msRemaining);
            return null;
        }

        let seconds: string | number = Math.floor((msRemaining / 1000) % 60),
            minutes: string | number = Math.floor((msRemaining / (1000 * 60)) % 60),
            hours: string | number = Math.floor((msRemaining / (1000 * 60 * 60)) % 24 ),
	          days: string | number = Math.floor(msRemaining / (1000 * 60 * 60 * 24));

        /**
         * Add the relevant `0` prefix if any of the numbers are less than 10
         * i.e. 5 -> 05
         */
	      days = (days < 10) ? '0' + days : days
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        hours = (hours < 10) ? '0' + hours : hours;
;
        return `${days} d : ${hours} Hr : ${minutes} Min : ${seconds} Sec`;
    }

    /**
     * @param futureDate    should be in a valid Date Time format
     *                      e.g. YYYY-MM-DDTHH:mm:ss.msz
     *                      e.g. 2021-06-04T17:27:10.740z
     */
    public transform(futureDate: string){
        /**
         * Initial check to see if time remaining is in the future
         * If not, don't bother creating an observable
         */
        if (!futureDate || this.getMsDiff(futureDate) < 0) {
            return null;
        }
        return timer(0, 1000).pipe(
            map(() => {
                return this.msToTime(this.getMsDiff(futureDate));
            })
        );
    }
}