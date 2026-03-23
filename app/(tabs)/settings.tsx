import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { save } from '../../components/storage';
import { useSettings } from '../../components/useSettings';
import { styles } from '@/components/styles'


export default function SettingsScreen() {
    const [interval, setInterval] = useState<string>("30"); // Interval between notification sends.
    const [timerLength, setTimerLength] = useState<string>("60"); // Length of timer.
    const [title, setTitle] = useState<string>("Reminder"); // Title of notification.
    const [body, setBody] = useState<string>("Stay active!"); // Body of notification.
    const updateSettings = useSettings((state) => state.setVals) // Hook to update the settings in the shared state.
    const intervalState = useSettings((state) => state.interval) // Interval from shared state.
    const timerLengthState = useSettings((state) => state.timerLength) // Timer length from shared state.
    const titleState = useSettings((state) => state.title) // Title from shared state.
    const bodyState = useSettings((state) => state.body) // Body from shared state.
    const [saveText, setSaveText] = useState<string>("SAVE"); // Save button text. 

    // Saves the current settings to both the shared state and the Expo secure store.
    async function onSave() {
        setSaveText("SAVED");
        updateSettings(interval, timerLength, title, body);
        save("interval", interval);
        save("timerLength", timerLength);
        save("title", title);
        save("body", body);
        setTimeout(() => setSaveText("SAVE"), 3000)
    }

    // Updates local values when shared state values change.
    useEffect(() => {
        setInterval(intervalState)
        setTimerLength(timerLengthState)
        setTitle(titleState)
        setBody(bodyState)
    }, [intervalState, timerLengthState, titleState, bodyState])

    return (
        <View style={[styles.container, {justifyContent: "flex-start", paddingTop: 70}]}>
            <Text style={styles.title}>Notification Interval:</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <TextInput 
                    keyboardType='numeric'
                    onChangeText={(text) => setInterval(text)}
                    value={interval}
                    maxLength={3}
                    style={styles.textInput}
                ></TextInput>
                <Text style={styles.text}>{interval === "1" ? "minute" : "minutes"}</Text>
            </View>
            <Text style={styles.title}>Timer Length:</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <TextInput 
                    keyboardType='numeric'
                    onChangeText={(text) => setTimerLength(text)}
                    value={timerLength}
                    maxLength={3}
                    style={styles.textInput}
                ></TextInput>
                <Text style={styles.text}>seconds</Text>
            </View>
            <Text style={styles.title}>Notification Title:</Text>
            <TextInput
                onChangeText={(text) => setTitle(text)}
                value={title}
                maxLength={50}
                style={styles.textInput}
            ></TextInput>
            <Text style={styles.title}>Notification Body:</Text>
            <View><TextInput
                onChangeText={(text) => setBody(text)}
                value={body}
                maxLength={50}
                style={styles.textInput}
            ></TextInput></View>
            <Pressable style={styles.actionButton} onPress={() => onSave()}>
                <Text style={styles.buttonText}>{saveText}</Text>
            </Pressable>
        </View>
    )
}