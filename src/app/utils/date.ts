import {
  startOfDay,
  endOfDay,
  startOfHour,
  endOfHour,
  startOfMinute,
  endOfMinute,
  addDays,
  format
} from 'date-fns';

export interface BoundaryTime {
  desc: string;
  start: number;
  end: number;
  format: string;
}

export default class DateUtil {
  static timesToNow(date: Date | number | string): string {
    const boundaryTimes = this.buildBoundaryTimesBaseOnNow();
    const dateTimestamp = date instanceof Date ? date.getTime() : new Date(date).getTime();

    for (const boundaryTime of boundaryTimes) {
      if (dateTimestamp >= boundaryTime.start && dateTimestamp < boundaryTime.end) {
        if (boundaryTime.desc === 'justNow') {
          return boundaryTime.format;
        }

        if (boundaryTime.desc === 'inOneHour') {
          return boundaryTime.format.replace(
            'x',
            String(new Date().getMinutes() - new Date(dateTimestamp).getMinutes())
          );
        }

        return format(new Date(dateTimestamp), boundaryTime.format);
      }
    }
  }

  private static buildBoundaryTimesBaseOnNow(): BoundaryTime[] {
    const boundaryTimes: BoundaryTime[] = [
      {
        desc: 'justNow',
        start: startOfMinute(new Date()).getTime(),
        end: endOfMinute(new Date()).getTime(),
        format: '刚刚'
      },
      {
        desc: 'inOneHour',
        start: startOfHour(new Date()).getTime(),
        end: endOfHour(new Date()).getTime(),
        format: 'x分钟前'
      },
      {
        desc: 'today',
        start: startOfDay(new Date()).getTime(),
        end: endOfDay(new Date()).getTime(),
        format: '今天 HH:mm'
      },
      {
        desc: 'yestoday',
        start: startOfDay(addDays(new Date(), -1)).getTime(),
        end: endOfDay(addDays(new Date(), -1)).getTime(),
        format: '昨天 HH:mm'
      },
      {
        desc: 'beforeYestoday',
        start: startOfDay(addDays(new Date(), -2)).getTime(),
        end: endOfDay(addDays(new Date(), -2)).getTime(),
        format: '前天 HH:mm'
      },
      {
        desc: 'curYear',
        start: startOfDay(new Date(new Date().getFullYear(), 1, 1)).getTime(),
        end: endOfDay(new Date(new Date().getFullYear(), 12, 31)).getTime(),
        format: 'MM月DD日 HH:mm'
      },
      {
        desc: 'anotherYear',
        start: startOfDay(new Date(1970, 1, 1)).getTime(),
        end: endOfDay(new Date(new Date().getFullYear() - 1, 12, 31)).getTime(),
        format: 'YYYY年MM月DD日 HH:mm'
      }
    ];

    return boundaryTimes;
  }
}
