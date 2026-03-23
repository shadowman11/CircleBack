import { Text, Button, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getValueFor } from '../../components/storage'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useSettings } from '@/store/useSettings';


export default function TimerScreen() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [key, setKey] = useState<number>(0);
    // const [timerLength, setTimerLength] = useState<string>("60");
    const timerLength = useSettings((state) => state.timerLength)
    
    function onReset() {
        setKey(key + 1)
        setIsPlaying(false)
    }

    return (
        <View style={styles.container}>
            <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={Number(timerLength)}
                colors={'#004777'}
                onComplete={() => onReset()}
            >
                {({ remainingTime }) => <Text>{remainingTime}</Text>}
            </CountdownCircleTimer>
            <Button title={isPlaying ? "Pause" : "Start"} onPress={() => setIsPlaying(!isPlaying)} />
            <Button title="Reset" onPress={() => onReset()} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    color: "white",
    backgroundColor: "#202020"
  }
});