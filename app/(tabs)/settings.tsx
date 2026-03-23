import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { save } from '../../components/storage';
import { useSettings } from '../../components/useSettings';
import { styles } from '@/components/styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default function SettingsScreen() {
    const [interval, setInterval] = useState<string>("30");
    const [timerLength, setTimerLength] = useState<string>("60");
    const [title, setTitle] = useState<string>("Reminder");
    const [body, setBody] = useState<string>("Stay active!");
    const updateSettings = useSettings((state) => state.setVals)
    const intervalState = useSettings((state) => state.interval)
    const timerLengthState = useSettings((state) => state.timerLength)
    const titleState = useSettings((state) => state.title)
    const bodyState = useSettings((state) => state.body)


    async function onSave() {
        updateSettings(interval, timerLength, title, body);
        save("interval", interval);
        save("timerLength", timerLength);
        save("title", title);
        save("body", body);
    }

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
                <Text style={styles.buttonText}>SAVE</Text>
            </Pressable>
        </View>
    )
}