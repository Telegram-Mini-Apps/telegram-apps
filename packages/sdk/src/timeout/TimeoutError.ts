export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Async call timeout exceeded. Timeout: ${timeout}`);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
