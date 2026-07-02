const splitsNamesSingular = ["giorno", "ora", "minuto", "secondo"];
const splitsNamesPlural = ["giorni", "ore", "minuti", "secondi"];

function getSplitStr(units: number[], idx: number): string {
  return `${units[idx]} ${units[idx] === 1 ? splitsNamesSingular[idx] : splitsNamesPlural[idx]}`;
}

export class Duration {
  private milliseconds: number;

  private constructor(milliseconds: number) {
    if (milliseconds < 0) {
      throw new Error("duration cannot be negative");
    }

    this.milliseconds = milliseconds;
  }

  static fromMilliseconds(milliseconds: number): Duration {
    return new Duration(milliseconds);
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60 * 1000);
  }

  static fromDays(days: number): Duration {
    return new Duration(days * 24 * 60 * 60 * 1000);
  }

  /**
   * Calculates how much time has passed, or needs to pass to reach {@link date}.
   *
   * @param date Date to use as reference.
   * @returns The duration.
   */
  static fromDate(date: Date): Duration {
    return new Duration(Math.abs(Date.now() - date.getTime()));
  }

  asMilliseconds(): number {
    return this.milliseconds;
  }

  asSeconds(): number {
    return Math.floor(this.milliseconds / 1000);
  }

  asMinutes(): number {
    return Math.floor(this.milliseconds / (1000 * 60));
  }

  asHours(): number {
    return Math.floor(this.milliseconds / (1000 * 60 * 60));
  }

  asDays(): number {
    return Math.floor(this.milliseconds / (1000 * 60 * 60 * 24));
  }

  /**
   * Formats the string by splitting it into its units, and showing only the
   * most relevant ones, up to {@link precision} or seconds.
   *
   * @param precision Number of smaller units to show.
   * @returns The formatted string.
   */
  toString(precision: number): string {
    const units = [this.asDays(), this.asHours() % 24, this.asMinutes() % 60, this.asSeconds() % 60];

    let startIdx = units.findIndex((s) => s !== 0);

    // If all units are 0, then show 0 seconds.
    if (startIdx === -1) {
      startIdx = units.length - 1;
    }

    let str = getSplitStr(units, startIdx);

    const maxIValue = Math.min(precision, units.length - startIdx);
    for (let i = 1; i < maxIValue; i++) {
      const separator = i === maxIValue - 1 ? " e " : ", ";
      str += `${separator}${getSplitStr(units, startIdx + i)}`;
    }

    return str;
  }

  /**
   * Formats the duration as ISO 8601 duration string.
   *
   * See https://en.wikipedia.org/wiki/ISO_8601#Durations
   *
   * @returns The formatted string.
   */
  toISOString(): string {
    return `P${this.asDays()}DT${this.asHours() % 24}H${this.asMinutes() % 60}M${this.asSeconds() % 60}S`;
  }
}
