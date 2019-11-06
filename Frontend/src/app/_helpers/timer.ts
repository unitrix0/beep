export class Timer {
  interval;

  constructor(private tick: (...args: any[]) => void, private intervalTime: number) {
  }

  start() {
    this.interval = setInterval(() => {
      this.tick();
    }, this.intervalTime);
  }

  stop() {
    clearInterval(this.interval);
  }
}
