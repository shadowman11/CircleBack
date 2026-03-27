import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useSettings } from '@/components/useSettings';
import { styles } from '@/components/styles'
import { useAudioPlayer } from 'expo-audio';

// Ding sound for timer completion.
const dingSound = require('@/assets/audio/ding.mp3');

export default function TimerScreen() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false) // Controls whether timer is counting down.
    const [key, setKey] = useState<number>(0); // Sets the key of the timer. Changing the key restarts the timer.  
    const timerLength = useSettings((state) => state.timerLength) // Timer length from shared state.
    const player = useAudioPlayer(dingSound) // Player for timer ding sound.

    // Resets timer.
    function onReset() {
        setKey(key + 1)
        setIsPlaying(false)
    }

    // Resets timer and plays a ding sound to indicate the timer is done. 
    function onComplete() {
        onReset();
        player.play();
        player.seekTo(0);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.actionButton, {borderWidth: 0, backgroundColor: "#ffffff00",}]}></View>
            <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={Number(timerLength)}
                colors={["#ff9500", "#55aa33"]}
                colorsTime={[Number(timerLength), 0]}
                trailColor="#444444"
                onComplete={() => onComplete()}
                size={270}
                strokeWidth={5}
            >
                {({ remainingTime }) => <Text style={styles.largeText}>{remainingTime}</Text>}
            </CountdownCircleTimer>
            <View style={{display: "flex", flexDirection: "row"}}>
                <Pressable style={[styles.actionButton, {borderColor: "#ff9500", backgroundColor: "#ff950010"}]} onPress={() => onReset()}>
                    <Text style={styles.buttonText}>RESET</Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={() => setIsPlaying(!isPlaying)}>
                    <Text style={styles.buttonText}>{isPlaying ? "PAUSE" : "START"}</Text>
                </Pressable>
            </View>
        </View>
    )
}