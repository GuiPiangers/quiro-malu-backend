type Listener<T> = (data: T) => Promise<void>;

export abstract class Observer<T> {
  private listeners: Map<string, Array<Listener<T>>> = new Map();

  on(identifier: string, callback: Listener<T>) {
    if (!this.listeners.has(identifier)) this.listeners.set(identifier, []);

    this.listeners.get(identifier)?.push(callback);
  }

  emit(identifier: string, data: T) {
    if (this.listeners.has(identifier)) {
      this.listeners.get(identifier)?.forEach((listener) => {
        listener(data);
      });
    }
  }
}
