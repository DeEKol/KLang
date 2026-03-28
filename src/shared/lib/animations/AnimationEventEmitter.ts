type AnimationEvent = "start" | "reset";

class AnimationEventEmitter {
  private listeners: ((event: AnimationEvent) => void)[] = [];

  subscribe(fn: (event: AnimationEvent) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== fn);
    };
  }

  emit(event: AnimationEvent) {
    this.listeners.forEach((fn) => fn(event));
  }
}

export const animationEventEmitter = new AnimationEventEmitter();
