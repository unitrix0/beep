interface Date {
  addDays(this: Date, days: number): Date;

  addMonths(this: Date, months: number): Date;

  addYears(this: Date, years: number): Date;

  addSeconds(this: Date, seconds: number): Date;

  addMilliseconds(this: Date, ms: number): Date;

  addMinutes(this: Date, minutes: number): Date;

  /**
   * Gibt ein Date-Objekt zurück bei dem nur das Datum gesetzt ist.
   */
  getDateOnly(this: Date): Date;
}

Date.prototype.getDateOnly = function (this: Date): Date {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

Date.prototype.addDays = function addDays(this: Date, days: number): Date {
  this.setDate(this.getDate() + days);
  return this;
};

Date.prototype.addMonths = function addMonths(this: Date, months: number): Date {
  this.setMonth(this.getMonth() + months);
  return this;
};

Date.prototype.addYears = function addYears(this: Date, years: number): Date {
  this.setFullYear(this.getFullYear() + years);
  return this;
};

Date.prototype.addSeconds = function addSeconds(this: Date, seconds: number): Date {
  this.setTime(this.getTime() + seconds);
  return this;
};

Date.prototype.addMilliseconds = function addMilliseconds(this: Date, ms: number): Date {
  this.setTime(this.getTime() + ms);
  return this;
};

Date.prototype.addMinutes = function addMinutes(this: Date, minutes: number): Date {
  this.setTime(this.getTime() + (minutes * 60000));
  return this;
};
