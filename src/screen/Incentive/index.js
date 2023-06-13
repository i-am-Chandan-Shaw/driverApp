import React from 'react';
import { View,Text } from 'react-native';
import style from './style';
import IncentiveMeter from '../../core/component/IncentiveMeter';
import { ScrollView } from 'react-native-gesture-handler';

const Incentive=()=>{
    const incentiveData={
        id:0,
        ridesCompleted:4,
        incentivesList:[
            {
                id:0,
                amount:50,
                totalRides:4,
            },
            {
                id:1,
                amount:80,
                totalRides:8,
            },
            {
                id:2,
                amount:100,
                totalRides:10,
            },
            
        ]
    }

    let incentiveArr = incentiveData.incentivesList.map(item => (
        <View key={item.id}>
            <IncentiveMeter ridesCompleted={incentiveData.ridesCompleted} data={item}/>
        </View>
    ))
return (
    <View>
        <View style={style.headerContainer}>
            <Text style={style.subHeaderText}>Incentives</Text>
        </View>
        <View style={style.offerBanner}>
            <Text style={[style.headerText, {color:'#000'}]}>Earn up to ₹230</Text>
            <Text style={[style.mediumText, {color:'#000'}]}>by completing 10 Rides</Text>
            <View style={style.whiteBanner}>
                <Text style={style.mediumText}>Offer only for today</Text>
            </View>
        </View>
        <ScrollView style={[style.incentiveContainer]} keyboardShouldPersistTaps='never'>
            {incentiveArr}
        </ScrollView>
    </View>
    )
}

export default Incentive;