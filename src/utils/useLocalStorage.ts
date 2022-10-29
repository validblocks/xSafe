import { useState } from 'react';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import { LocalStorageObserver } from './LocalStorageObserver';

export function useLocalStorage<T>(key: LOCAL_STORAGE_KEYS, initialValue: T) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  LocalStorageObserver.subscribe(key, setStoredValue);

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      LocalStorageObserver.publish(key, valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error on Local Storage: ', error);
    }
  };
  return [storedValue, setValue];
}
