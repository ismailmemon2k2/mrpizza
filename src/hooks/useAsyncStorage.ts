import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(key)
      .then((stored) => {
        if (isMounted && stored) {
          setValue(JSON.parse(stored) as T);
        }
      })
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      AsyncStorage.setItem(key, JSON.stringify(next)).catch((error) => {
        console.warn(`Failed to persist "${key}" to AsyncStorage`, error);
      });
    },
    [key],
  );

  return { value, setValue: update, isHydrated };
}
