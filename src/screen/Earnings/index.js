import React from 'react';
import { View,Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import style from './style';
import { useNavigation } from '@react-navigation/native';
const Earnings=()=>{

    const navigation= useNavigation();

    const navigateTo=(url)=>{
        navigation.navigate(url)
    }

return (
    <View>
        <View style={style.headerContainer}>
            <Text style={style.subHeaderText}>Earnings</Text>
        </View>
        <View style={style.offerBanner}>
            <Text style={[style.poppinsMedium, {color:'#fff'}]}>Today's Earnings</Text>
            <Text style={[style.headerText, {color:'#fff'}]}>₹ 230</Text>
            <Text style={[style.poppinsMedium,{color:'#fff'}]}>2 Rides Completed</Text>
        </View>
        <Pressable android_ripple={{color: '#eee', borderless: false}} 
        onPress={()=>{navigateTo('RideHistory')}}  style={[style.boxContainer]} >
            <View style={style.optionContainer}>
                <EntypoIcon name='shopping-cart' size={22} color='#228b22' />
                <View style={{marginHorizontal:20}}>
                    <Text style={style.mediumText}>Orders</Text>
                </View>
            </View>
            <AntIcon name='arrowright' size={24} color='#000' />
        </Pressable>
        <Pressable android_ripple={{color: '#eee', borderless: false}} 
        onPress={()=>{navigateTo('Wallet')}} style={[style.boxContainer]}>
            <View style={style.optionContainer}>
                <EntypoIcon name='wallet' size={22} color='#228b22' />
                <View style={{marginHorizontal:20}}>
                    <Text style={style.mediumText}>Wallet</Text>
                </View>
            </View>
            <AntIcon name='arrowright' size={24} color='#000' />
        </Pressable>
        <Pressable android_ripple={{color: '#eee', borderless: false}} 
        onPress={()=>{navigateTo('EarningHistory')}} style={[style.boxContainer]}>
            <View style={style.optionContainer}>
                <FAIcon name='bank' size={20} color='#228b22' />
                <View style={{marginHorizontal:20}}>
                    <Text style={style.mediumText}>Earning History</Text>
                </View>
            </View>
            <AntIcon name='arrowright' size={24} color='#000' />
        </Pressable>

    </View>
    )
}

export default Earnings;