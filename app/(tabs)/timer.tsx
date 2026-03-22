import { Text, Button, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

export default function TimerScreen() {
    const [isPlaying, setIsPlaying] = useState(false)
    
    return (
        <View>
            <CountdownCircleTimer
                isPlaying={isPlaying}
                duration={7}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                updateInterval={1}
            >
                {({ remainingTime }) => <Text>{remainingTime}</Text>}
            </CountdownCircleTimer>
            <Button title="Toggle Playing" onPress={() => setIsPlaying(prev => !prev)} />
        </View>
    )
}