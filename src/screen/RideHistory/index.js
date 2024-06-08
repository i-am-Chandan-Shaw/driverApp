import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import RideStatus from '../../core/component/RideStatus';
import style from './style';
import { ScrollView } from 'react-native-gesture-handler';
import AppCalendarStrip from '../../core/component/AppCalendarStrip';
import { AppContext } from '../../core/helper/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../../core/helper/services';
import AppLoader from '../../core/component/AppLoader';
import imagePath from '../../constants/imagePath';

const RideHistory = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [rideData, setRideData] = useState([]);


    useEffect(() => {
        // getOderHistory()
        getDriverId();
    }, []);


    const getDriverId = async () => {
        try {
            let id = await AsyncStorage.getItem('driverId');
            if (id) {
                getOderHistory(id);
            }
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }


    const getOderHistory = async (id) => {
        setIsLoading(true);
        const queryParameter = '?driverId=' + id.toString()
        try {

            const data = await get('getAllRides', queryParameter);
            if (data) {
                setRideData(data)
                console.log(rideData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('getOderHistory=>', error);
            setIsLoading(false);

        }
    }



    return (
        <>
            <AppCalendarStrip />
            {isLoading && <AppLoader styles={{ top: '40%' }} />}
            {!isLoading && <ScrollView style={style.mainContainer}>
                {rideData?.map((item, index) => (
                    <RideStatus data={item} />
                ))}

                {rideData.length == 0 && <View style={style.emptyContainer}>
                    <Image style={{ height: 50, width: 50, marginBottom:10 }} source={imagePath.noDataFound} />
                    <Text>No data found</Text>
                </View>}

            </ScrollView>}
        </>

    )
}

export default RideHistory;