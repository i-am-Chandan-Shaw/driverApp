import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import useStyles from './style';
import { useTheme } from '../../../constants/ThemeContext';

const AppSwitch = ({ toggleSwitch }) => {
    const styles = useStyles();

    const {theme} = useTheme()
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const onToggleSwitch = () => {
        toggleSwitch()
        setIsSwitchOn((prev) => !prev);
    };

    return (
        <View>
            <TouchableWithoutFeedback onPress={onToggleSwitch}>
                <View style={styles.container}>
                    <View style={[styles.switchTrack, { backgroundColor: isSwitchOn ? theme.bgPrimary : '#ccc' }]}>
                        <Text style={isSwitchOn ? styles.textLeft : styles.textRight}>{isSwitchOn ? 'Online' : 'Offline'}</Text>
                        <View style={[styles.thumb, { left: isSwitchOn ? 81 : 3 }]} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default AppSwitch;