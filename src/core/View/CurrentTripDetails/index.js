import React, { useState } from 'react';
import { View, Text, Linking, Pressable, PanResponder, Animated, Dimensions } from 'react-native';
import { Avatar } from 'react-native-paper';
import FAIcons from 'react-native-vector-icons/FontAwesome';
import MatIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import style from './style';
import { useNavigation } from '@react-navigation/native';
const CurrentTripDetails = ({ data,startTrip, endTrip, userData }) => {
    const callDriver = () => {
        Linking.openURL(`tel:${data.driverNumber}`)
    }

    const navigation = useNavigation();

    const SCREEN_WIDTH = Dimensions.get('window').width;

    const [sliderValue, setSliderValue] = useState(0);
    const [tripStatus, setTripStatus]= useState({
        isStarted:false,
        isEnded:false
    });
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            let value = gestureState.moveX / SCREEN_WIDTH * 0.79;
            value = Math.min(1, Math.max(0, value)); // Clamp the value between 0 and 1
            setSliderValue(value);
            
        },
        onPanResponderRelease: () => {
            if (sliderValue <= 0.6) {
                // Go back to 0% if dragged less than or equal to 80%
                setSliderValue(0);
            } else {
                if(!tripStatus.isStarted){
                    setTripStatus((status)=>{
                        status.isStarted=true
                        return status
                    })
                    startTrip()
                    setSliderValue(0);
                }else{
                    console.log('end trip');
                    endTrip();
                    navigation.navigate('RatingScreen', { user: userData })
                }
            }
        },
    });


    return (
        <View>
            <View style={style.topContainer}>
                <View style={style.alignCenter}>
                    <View style={{ marginRight: 15 }}></View>
                    <Avatar.Text size={34} label="AK" />
                    <View style={{ marginRight: 10 }}></View>
                    <Text style={{ fontSize: 16, color: '#000' }}>{userData?.name} ,</Text>
                    <View style={{ marginRight: 20 }}></View>
                    <Text style={{ fontSize: 16, color: '#000' }}>4.3 </Text>
                    <FAIcons name='star' color='#f4c430' size={13} />
                </View>
                <Pressable onPress={callDriver} style={[style.alignCenter, { marginRight: 20 }]}>
                    <View style={style.phoneContainer}>
                        <FeatherIcon name='phone-call' color='#333' size={20} />
                    </View>
                </Pressable>
            </View>
             <View style={style.bottomContainer}>
                <View style={[style.slider, {backgroundColor: tripStatus.isStarted?'#B31312':'#4773fa'}]}>
                    <View style={[style.track, { width: `${(sliderValue) * 100}%`, backgroundColor: tripStatus.isStarted?'#B31312':'#4773fa' }]} >
                    </View>
                    <View
                        {...panResponder.panHandlers}
                        style={[style.thumb, { left: `${sliderValue * 100}%` }]}
                    >
                        <MatIcons name='arrow-forward-ios' color={tripStatus.isStarted?'#B31312':'#4773fa'} size={20} />
                    </View>
                     <Text  style={[style.sliderText, { left: `${(sliderValue * 100)+ 30}%`, opacity: 1 - sliderValue}]}>
                        {tripStatus.isStarted?'Swipe to end trip':'Swipe to start trip'}
                    </Text>
                </View>
            </View>
            
        </View>
    )
}

export default CurrentTripDetails;