import React from 'react';
import { View, Text } from 'react-native';
import RideStatus from '../../core/component/RideStatus';
import style from './style';
import { ScrollView } from 'react-native-gesture-handler';
import AppCalendarStrip from '../../core/component/AppCalendarStrip';

const RideHistory = () => {

    const rideData = [
        {
            id: 1,
            pickup: '1/30/21 Kundu Bagan, Beleghata,Dr. SC Banerjee Road Kolkata:700085',
            drop: 'Vivek Vihar, Priya Mana Basti Narao Howrah:700129',
            date: 'Sat, Mar 04',
            time: '01:52 PM',
            status: 'Completed',
            amount: '867.00',
            vehicleType: 'tataAce',
            vehicleName: 'Tata Ace',
            tripId: '16997782'
        },
        {
            id: 0,
            pickup: 'Sealdah, Raja Bazar, Kolkata, West Bengal 700014',
            drop: '59, Sitaram Ghosh St, College Row, College Street, Kolkata, West Bengal 700009',
            date: 'Thu, 22 Mar',
            time: '03:15 PM',
            status: 'Cancelled',
            amount: '0.00',
            vehicleType: 'bolero',
            vehicleName: 'Bolero',
            tripId: '11237782'
        }

    ]

    return (
        <>
            <AppCalendarStrip />
            <ScrollView style={style.mainContainer}>
                <RideStatus data={rideData[0]} />
                <RideStatus data={rideData[0]} />
                <RideStatus data={rideData[1]} />
                <RideStatus data={rideData[0]} />
                <RideStatus data={rideData[1]} />
                <RideStatus data={rideData[0]} />
                <RideStatus data={rideData[1]} />
                <RideStatus data={rideData[0]} />
                <RideStatus data={rideData[1]} />
                <RideStatus data={rideData[1]} />
            </ScrollView>
        </>

    )
}

export default RideHistory;