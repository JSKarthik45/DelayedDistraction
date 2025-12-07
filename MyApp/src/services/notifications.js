import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications behavior (foreground shows alert)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationSetup() {
  // Request permissions if not granted
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }

  // Android channel for modern look
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('no-scroll-reminders', {
      name: 'No-Scroll Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      vibrationPattern: [0, 100, 100],
      lightColor: '#739552',
    });
  }

  return status === 'granted';
}

export async function sendReminderNotification({ title, body }) {
  // Route to channel on Android
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: null,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger: null, // deliver immediately
  });
}
