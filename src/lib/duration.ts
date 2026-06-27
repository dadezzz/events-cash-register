export class Duration {
  private milliseconds: number;

  private constructor(milliseconds: number) {
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
}
