import { Button, Text, StyleSheet, View, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';


async function save(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        alert(e);
    }
}

async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } 
}

export default function SettingsScreen() {
    const [interval, setInterval] = useState<string>("30");
    const [timerLength, setTimerLength] = useState<string>("60");
    const [title, setTitle] = useState<string>("Reminder");
    const [body, setBody] = useState<string>("Stay active!");

    async function onSave() {
        save("interval", interval);
        save("timerLength", timerLength);
        save("title", title);
        save("body", body);
    }

    async function getCurrentVals() {
        try {
            const storedInterval = await getValueFor("interval");
            const storedTimerLength = await getValueFor("timerLength");
            const storedTitle = await getValueFor("title");
            const storedBody = await getValueFor("body");
            
            if (storedInterval) {
                setInterval(storedInterval)
            }
            if (storedTimerLength) {
                setTimerLength(storedTimerLength)
            }
            if (storedTitle) {
                setTitle(storedTitle)
            }
            if (storedBody) {
                setBody(storedBody)
            }
            
            return [storedInterval, storedTimerLength, storedTitle, storedBody]
        } catch (e) {
            alert(e);
        }
    }

    useEffect(() => {
        getCurrentVals();
    }, []);

    return (
        <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.title}>Notification Interval:</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <TextInput 
                    keyboardType='numeric'
                    onChangeText={(text) => setInterval(text)}
                    value={interval}
                    maxLength={3}
                    style={styles.textInput}
                ></TextInput>
                <Text style={styles.text}>minutes</Text>
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
                maxLength={100}
                style={styles.textInput}
            ></TextInput>
            <Text style={styles.title}>Notification Body:</Text>
            <TextInput
                onChangeText={(text) => setBody(text)}
                value={body}
                maxLength={100}
                style={styles.textInput}
            ></TextInput>
            <Button title="SAVE" onPress={() => onSave()}></Button>
        </View>
    )
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
        width: 100,
        color: 'white'
    },
});