import { Button, Platform, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const [active, setActive] = useState<boolean>(false);
  
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }, []);
  
  function onToggleActive() {
    const curActive = active; // get current state of active variable to avoid concurrency issues
    setActive(!curActive)

    try {
      if (!curActive) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reminder',
            body: "Stay active!",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            repeats: true,
          },
        });
      } else {
        Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (e) {
      alert(e);
    }
    
  }

  return (
    <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <View>
        <Button title={active ? "TURN OFF" : "TURN ON"} onPress={() => onToggleActive()} />
      </View>
    </View>
  );
}
