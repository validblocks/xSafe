export type Listener<EventType> = (event: EventType) => void;

export type ObserverReturnType<KeyType, EventType> = {
  subscribe: (entryKey: KeyType, listener: Listener<EventType>) => () => void;
  publish: (entryKey: KeyType, event: EventType) => void;
};

export default function createObserver<
  KeyType extends string | number | symbol,
  EventType,
>(): ObserverReturnType<KeyType, EventType> {
  const listeners: Record<KeyType, Listener<EventType>[]> = {} as Record<
    KeyType,
    Listener<EventType>[]
  >;

  return {
    subscribe: (entryKey: KeyType, listener: Listener<EventType>) => {
      if (!listeners[entryKey]) listeners[entryKey] = [];
      listeners[entryKey].push(listener);
      return () => {
        listeners[entryKey].splice(listeners[entryKey].indexOf(listener), 1);
      };
    },
    publish: (entryKey: KeyType, event: EventType) => {
      if (!listeners[entryKey]) listeners[entryKey] = [];
      listeners[entryKey].forEach((listener: Listener<EventType>) =>
        listener(event),
      );
    },
  };
}
