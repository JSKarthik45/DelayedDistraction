import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  blockedApps: 'dd_blocked_apps',
  problemTarget: 'dd_problem_target',
};

export async function loadPreferences() {
  try {
    const [blockedStr, targetStr] = await Promise.all([
      AsyncStorage.getItem(KEYS.blockedApps),
      AsyncStorage.getItem(KEYS.problemTarget),
    ]);
    const blocked = blockedStr ? JSON.parse(blockedStr) : {};
    const problemTarget = targetStr ? Number(targetStr) : 5;
    return { blocked, problemTarget };
  } catch (e) {
    return { blocked: {}, problemTarget: 5 };
  }
}

export async function savePreferences({ blocked, problemTarget }) {
  try {
    await Promise.all([
      AsyncStorage.setItem(KEYS.blockedApps, JSON.stringify(blocked || {})),
      AsyncStorage.setItem(KEYS.problemTarget, String(problemTarget ?? 5)),
    ]);
  } catch (e) {
    // ignore
  }
}

export async function setBlocked(blocked) {
  try {
    await AsyncStorage.setItem(KEYS.blockedApps, JSON.stringify(blocked || {}));
  } catch {}
}

export async function setProblemTarget(value) {
  try {
    await AsyncStorage.setItem(KEYS.problemTarget, String(value ?? 5));
  } catch {}
}
