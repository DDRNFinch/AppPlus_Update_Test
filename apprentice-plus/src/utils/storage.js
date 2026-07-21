import AsyncStorage from "@react-native-async-storage/async-storage";

const NAMESPACE = "@apprenticeplus";

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(`${NAMESPACE}:${key}`);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("storage.loadJSON failed", key, e);
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("storage.saveJSON failed", key, e);
    return false;
  }
}

export async function removeKey(key) {
  try {
    await AsyncStorage.removeItem(`${NAMESPACE}:${key}`);
  } catch (e) {
    console.warn("storage.removeKey failed", key, e);
  }
}
