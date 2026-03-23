import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Platform, Text, View } from 'react-native';
import { getValueFor, save } from '../../components/storage';
import { useSettings } from '../../components/useSettings';
import { styles } from '@/components/styles'


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
    const [interval, setInterval] = useState<string>("30");
    const [title, setTitle] = useState<string>("Reminder");
    const [body, setBody] = useState<string>("Stay active!");
    const intervalState = useSettings((state) => state.interval)
    const titleState = useSettings((state) => state.title)
    const bodyState = useSettings((state) => state.body)
    const updateSettings = useSettings((state) => state.setVals)
    const router = useRouter();
    
    async function getCurrentVals() {
        try {
            const storedActive = await getValueFor("active");
            const storedInterval = await getValueFor("interval");
            const storedTimerLength = await getValueFor("timerLength");
            const storedTitle = await getValueFor("title");
            const storedBody = await getValueFor("body");
            
            setActive(storedActive === "true");
            
            updateSettings(storedInterval, storedTimerLength, storedTitle, storedBody)
            
            return [storedActive, storedInterval, storedTitle, storedBody]
        } catch (e) {
            alert(e);
        }
    }

    useEffect(() => {
        setInterval(intervalState)
        setTitle(titleState)
        setBody(bodyState)
    }, [intervalState, titleState, bodyState])
    
    useEffect(() => {
        getCurrentVals();
        
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (!response) return;
            router.push("/(tabs)/timer");
        });

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            router.push("/(tabs)/timer");
        });

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            });
        }

        return () => subscription.remove();
    }, []);
    
    async function onToggleActive() {
        const curActive = active; // get current state of active variable to avoid concurrency issues
        setActive(!curActive)
        save("active", (!curActive).toString())

        try {
            if (!curActive) {
                const storedVals = await getCurrentVals();

                if (!storedVals) throw new Error("Could not get stored values.")

                Notifications.scheduleNotificationAsync({
                    content: {
                        title: storedVals[2] ?? title,
                        body: storedVals[3] ?? body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: 60 * Number(storedVals[1] ?? interval),
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
        <View style={styles.container}>
            <Pressable style={active ? styles.activeButton : styles.inactiveButton}  onPress={() => onToggleActive()}>
                <Text style={styles.largeText}>{active ? "ON" : "OFF"}</Text>
            </Pressable>
        </View>
    );
}