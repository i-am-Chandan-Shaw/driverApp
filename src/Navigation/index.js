import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, Alert } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/Home';
import ChooseLocation from '../screen/ChooseLocation';
import SplashScreen from '../screen/SplashScreen';
import BookingScreen from '../screen/BookingScreen';
import Login from '../screen/Login';
import TripDetails from '../screen/TripDetails';
import RideHistory from '../screen/RideHistory';
import Wallet from '../screen/Wallet';
import EarningHistory from '../screen/EarningHistory';
import Verification from '../screen/Verification';
import Register from '../screen/Register';
import BankDetails from '../screen/BankDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../core/helper/AppContext';
import LiveTracking from '../screen/LiveTracking';
import RatingScreen from '../screen/RatingScreen';
import { get } from '../core/helper/services';
import TermsAndConditions from '../screen/TermsAndConditions';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { globalData, setGlobalData } = useContext(AppContext)
  useEffect(() => {
    getDataFromStorage('driverId');
  }, []);

  const getDataFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setGlobalData(key, JSON.parse(value));
        if(key=='driverId'){
          setDriverLocally(value)
        }
      } else {
        console.log(key, 'Data not found!');
        return false
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
      return false
    }
  }

  const setDataToLocalStorage = async(key,data)=>{
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));;
      console.log('Data saved successfully!');
    } catch (error) {
      console.log('Error retrieving data:', error);
      return false
    }
  }

  const setDriverLocally = async (id) => {
    const queryParameter = '?driverId=' + id.toString()
    try {
        const data = await get('getDriver', queryParameter);
        if (data) {
          setGlobalData('driverData', JSON.parse(data));
          setDataToLocalStorage('driverData',data)
        }
    } catch (error) {
        console.log(error);
        getDataFromStorage('driverData');
    }
}


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="LiveTracking" component={LiveTracking} />
        <Stack.Screen name="BankDetails" options={{ headerShown: true, title: 'Bank Details' }} component={BankDetails} />
        <Stack.Screen name="TermsAndConditions" options={{ headerShown: true, title: 'Terms & Conditions' }} component={TermsAndConditions} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
        <Stack.Screen name="Verification" options={{ headerShown: true, title: 'Verification' }} component={Verification} />
        <Stack.Screen name="EarningHistory" options={{ headerShown: true, title: 'Earning History' }} component={EarningHistory} />
        <Stack.Screen name="RideHistory" options={{ headerShown: true, title: 'Orders' }} component={RideHistory} />
        <Stack.Screen name="Wallet" options={{ headerShown: true, title: 'Wallet' }} component={Wallet} />
        <Stack.Screen name="TripDetails" options={{ headerShown: true, title: 'Trip Details' }} component={TripDetails} />
        <Stack.Screen name="Rating" component={RatingScreen} options={{ headerShown: true, title: 'Rating & Review' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;