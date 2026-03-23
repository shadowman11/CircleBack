import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Platform, Text, View } from 'react-native';
import { getValueFor, save } from '../../components/storage';
import { useSettings } from '../../components/useSettings';
import { styles } from '@/components/styles'


// Set notification settings.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function HomeScreen() {
    const [active, setActive] = useState<boolean>(false); // Controls whether the notifications are running or not.
    const [interval, setInterval] = useState<string>("30"); // Interval between notification sends.
    const [title, setTitle] = useState<string>("Reminder"); // Title of notification.
    const [body, setBody] = useState<string>("Stay active!"); // Body of notification.
    const updateSettings = useSettings((state) => state.setVals) // Hook to update the settings in the shared state.
    const intervalState = useSettings((state) => state.interval) // Interval from shared state.
    const titleState = useSettings((state) => state.title) // Title from shared state.
    const bodyState = useSettings((state) => state.body) // Body from shared state.
    const router = useRouter();
    
    // Gets values from Expo secure store and updates active variable and shared.
    async function getCurrentVals() {
        try {
            const storedActive = await getValueFor("active");
            const storedInterval = await getValueFor("interval");
            const storedTimerLength = await getValueFor("timerLength");
            const storedTitle = await getValueFor("title");
            const storedBody = await getValueFor("body");
            
            setActive(storedActive === "true");
            
            if (storedInterval && storedTimerLength && storedTitle && storedBody) {
                updateSettings(storedInterval, storedTimerLength, storedTitle, storedBody);
            } else {
                updateSettings("30", "60", "Reminder", "Stay active!");
            }
        } catch (e) {
            alert(e);
        }
    }

    // Updates local values when shared state values change.
    useEffect(() => {
        setInterval(intervalState)
        setTitle(titleState)
        setBody(bodyState)
    }, [intervalState, titleState, bodyState])
    
    // Runs on page load.
    useEffect(() => {
        getCurrentVals();
        
        // Redirect to timer page if the app opened from a notification.
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (!response) return;
            router.push("/(tabs)/timer");
        });

        // Redirect to timer page if the app was already open and a notification was clicked.
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            router.push("/(tabs)/timer");
        });

        // Set notification channel for android.
        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            });
        }

        return () => subscription.remove();
    }, []);
    
    // Turns notifications on and off.
    async function onToggleActive() {
        // Get current state of active variable to avoid concurrency issues with updating useState.
        const curActive = active; 
        setActive(!curActive)
        // Update in Expo secure store.
        save("active", (!curActive).toString())

        try {
            if (!curActive) {
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: title,
                        body: body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: 60 * Number(interval),
                        repeats: true,
                    }
                });
            } else {
                Notifications.cancelAllScheduledNotificationsAsync();
            }
        } catch (e) {
            alert(e);
        }
        
    }

    return (
        <View style={styles.container}>
            <Pressable style={active ? styles.activeButton : styles.inactiveButton}  onPress={() => onToggleActive()}>
                <Text style={styles.largeText}>{active ? "ON" : "OFF"}</Text>
            </Pressable>
        </View>
    );
}