export default class Dato {
  public static readonly yearPattern = /Y{4}/g;
  public static readonly monthPattern = /M{1,2}/g;
  public static readonly dayPattern = /D{1,2}/g;
  public static readonly hourPattern = /H{2}/g;
  public static readonly minutePattern = /m{2}/g;
  public static readonly secondPattern = /S{2}/g;
  public static readonly milliPattern = /s{3}/g;

  public static now(fmt?: string) {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    const second = date.getSeconds().toString();
    const millisecond = date.getMilliseconds().toString();

    if (fmt) {
      const years = fmt.match(Dato.yearPattern);
      const months = fmt.match(Dato.monthPattern);
      const days = fmt.match(Dato.dayPattern);
      const hours = fmt.match(Dato.hourPattern);
      const minutes = fmt.match(Dato.minutePattern);
      const seconds = fmt.match(Dato.secondPattern);
      const milliseconds = fmt.match(Dato.milliPattern);

      if (years) {
        fmt = fmt.replace(Dato.yearPattern, year);
      } else {
        fmt = fmt.replace(Dato.yearPattern, "");
      }

      if (months.length) {
        if (String(months[0]).length === 2) {
          fmt = fmt.replace(
            Dato.monthPattern,
            month.length === 1 ? "0" + month : month
          );
        } else if (String(months[0]).length === 1) {
          fmt = fmt.replace(Dato.monthPattern, month);
        }
      } else {
        fmt = fmt.replace(Dato.monthPattern, "");
      }

      if (days.length) {
        if (String(days[0]).length === 2) {
          fmt = fmt.replace(
            Dato.dayPattern,
            day.length === 1 ? "0" + day : day
          );
        } else if (String(days[0]).length === 1) {
          fmt = fmt.replace(Dato.dayPattern, String(date.getDate()));
        }
      } else {
        fmt = fmt.replace(Dato.dayPattern, "");
      }

      if (hours) {
        fmt = fmt.replace(Dato.hourPattern, hour.length === 2 ? hour : "0" + hour);
      } else {
        fmt = fmt.replace(Dato.hourPattern, "");
      }

      if (minutes) {
        fmt = fmt.replace(
          Dato.minutePattern,
          minute.length === 2 ? minute : "0" + minute
        );
      } else {
        fmt = fmt.replace(Dato.minutePattern, "");
      }

      if (seconds) {
        fmt = fmt.replace(
          Dato.secondPattern,
          second.length === 2 ? second : "0" + second
        );
      } else {
        fmt = fmt.replace(Dato.secondPattern, "");
      }

      if (milliseconds) {
        fmt = fmt.replace(
          Dato.milliPattern,
          millisecond.length === 3
            ? millisecond
            : millisecond.length === 2
              ? "0" + millisecond
              : "00" + millisecond
        );
      } else {
        fmt = fmt.replace(Dato.milliPattern, "");
      }

      return fmt;
    }

    return date.toISOString();
  }
}
