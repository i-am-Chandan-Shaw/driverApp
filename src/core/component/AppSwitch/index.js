import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import style from './style';

const AppSwitch = ({toggleSwitch}) => {

    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const onToggleSwitch = () => {
        toggleSwitch()
        setIsSwitchOn((prev) => !prev);
    };

    return (
        <View>
            <TouchableWithoutFeedback onPress={onToggleSwitch}>
                <View style={style.container}>
                    <View style={[style.switchTrack, { backgroundColor: isSwitchOn ? '#4773fa' : '#ccc' }]}>
                         <Text style={isSwitchOn? style.textLeft: style.textRight}>{isSwitchOn ? 'Online' : 'Offline'}</Text>
                        <View style={[style.thumb, { left: isSwitchOn ? 93 : 3 }]} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default AppSwitch;