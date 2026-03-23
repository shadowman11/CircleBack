import { Text, Button, Platform, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { save, getValueFor } from '../../components/storage';
import { useRouter } from 'expo-router';
import { useSettings } from '../../store/useSettings';


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
        <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <View>
                <Button title={active ? "TURN OFF" : "TURN ON"} onPress={() => onToggleActive()} />
            </View>
            <Text style={styles.text}>{Number(interval)}</Text>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>{body}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    title: {
        marginTop: 30,
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white"
    },
    text: {
        margin: 10,
        fontSize: 16,
        color: "#eeeeee"
    },
    textInput: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 4,
        width: 100
    },
});