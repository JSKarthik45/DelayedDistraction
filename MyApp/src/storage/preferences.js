import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  blockedApps: 'dd_blocked_apps',
  problemTarget: 'dd_problem_target',
  themePrimary: 'dd_theme_primary',
  themeSecondary: 'dd_theme_secondary',
  themeKey: 'dd_theme_key',
};

export async function loadPreferences() {
  try {
    const [blockedStr, targetStr, primary, secondary, themeKey] = await Promise.all([
      AsyncStorage.getItem(KEYS.blockedApps),
      AsyncStorage.getItem(KEYS.problemTarget),
      AsyncStorage.getItem(KEYS.themePrimary),
      AsyncStorage.getItem(KEYS.themeSecondary),
      AsyncStorage.getItem(KEYS.themeKey),
    ]);
    const blocked = blockedStr ? JSON.parse(blockedStr) : {};
    const problemTarget = targetStr ? Number(targetStr) : 5;
    const theme = (primary && secondary) ? { key: themeKey || 'classic', primary, secondary } : null;
    return { blocked, problemTarget, theme };
  } catch (e) {
    return { blocked: {}, problemTarget: 5, theme: null };
  }
}

export async function savePreferences({ blocked, problemTarget, theme }) {
  try {
    const tasks = [
      AsyncStorage.setItem(KEYS.blockedApps, JSON.stringify(blocked || {})),
      AsyncStorage.setItem(KEYS.problemTarget, String(problemTarget ?? 5)),
    ];
    if (theme && theme.primary && theme.secondary) {
      tasks.push(AsyncStorage.setItem(KEYS.themePrimary, theme.primary));
      tasks.push(AsyncStorage.setItem(KEYS.themeSecondary, theme.secondary));
      tasks.push(AsyncStorage.setItem(KEYS.themeKey, theme.key || 'custom'));
    }
    await Promise.all(tasks);
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

export async function setTheme(theme) {
  try {
    if (theme && theme.primary && theme.secondary) {
      await Promise.all([
        AsyncStorage.setItem(KEYS.themePrimary, theme.primary),
        AsyncStorage.setItem(KEYS.themeSecondary, theme.secondary),
        AsyncStorage.setItem(KEYS.themeKey, theme.key || 'custom'),
      ]);
    }
  } catch {}
}
