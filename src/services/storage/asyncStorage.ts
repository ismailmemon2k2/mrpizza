import AsyncStorage from "@react-native-async-storage/async-storage";

// Single seam between the app and the persistence mechanism. Swapping
// AsyncStorage for a backend API later only means rewriting the repositories
// in this folder — nothing above this layer touches AsyncStorage directly.
export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Failed to read "${key}" from AsyncStorage`, error);
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write "${key}" to AsyncStorage`, error);
  }
}
