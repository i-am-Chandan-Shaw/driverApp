import React from 'react';
import { View, Text } from 'react-native';
import style from './style';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AppDivider from '../AppDivider';

const IncentiveMeter = ({ data, ridesCompleted, styles }) => {
    const progressValue = ((ridesCompleted * 100) / data.totalRides) / 100;
    const isCompleted = data.totalRides / ridesCompleted == 1 ? true : false
    return (
        <View style={[style.mainContainer, styles]}>
            <View style={style.topContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={style.subHeaderText}>Earn an extra ₹{data.amount}</Text>
                    {isCompleted && <View style={{ marginLeft: 10 }}>
                        <AntIcon name='checkcircle' color='#228b22' size={18} />
                    </View>}

                </View>
                <Text style={style.mediumText}>{ridesCompleted}/{data.totalRides} rides</Text>
            </View>
            <ProgressBar progress={progressValue} style={{ height: 10, borderRadius: 10 }} color={isCompleted ? '#228b22' : MD3Colors.error60} />
            <View style={{ marginTop: 25 }}>
                <AppDivider bgColor={'#ddd'} />
            </View>
        </View>
    )
}

export default IncentiveMeter;