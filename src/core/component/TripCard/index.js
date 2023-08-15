import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import style from './style';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../helper/AppContext';
import { patch } from '../../helper/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TripCard = ({ cardData, sendData,userData }) => {
    const [renderedData, setRenderedData] = useState([cardData[0]]);
    const { globalData, setGlobalData } = useContext(AppContext);
    const [isLoading, setIsLoading]= useState(false)
    
    const navigation = useNavigation();
    useEffect(() => {
        let currentIndex = 1;
        const interval = setInterval(() => {
            if (currentIndex < cardData.length) {
                setRenderedData((prevData) => [...prevData, cardData[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    


    const declineRide=(item)=>{
        const updatedData= [...renderedData]
        let index= updatedData.indexOf(item)
        updatedData.splice(index, 1)
        setRenderedData(updatedData);
        if(updatedData.length==0){
            sendData(updatedData, 'declined')
        }
    }

    const acceptRide=async(user,trip)=>{
        storeTripId(trip.tripId)
        setIsLoading(true)
        const payload={
            id:trip.tripId,
            status:2
        }
        try {
            const data = await patch(payload, 'patchRequestVehicle');
            if (data) {
                const updatedData= []
                sendData(updatedData,'accepted');
                trackLive(user,trip);
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error);

        }
    }


    const trackLive = (user) => {
        const startLatitude = 22.567805; // Replace with your start location's latitude
        const startLongitude = 88.371133; // Replace with your start location's longitude
        const destinationLatitude = 22.580873; // Replace with your destination's latitude
        const destinationLongitude = 88.309744; // Replace with your destination's longitude
        const LATITUDE_DELTA=0.0122
        const LONGITUDE_DELTA=0.0061627689429373245
        
        let data = {
            "drop": "Drop",
            "dropCoords": {
                "latitude": destinationLatitude,
                "longitude": destinationLongitude,
                "latitudeDelta": LATITUDE_DELTA,
                "longitudeDelta": LONGITUDE_DELTA
            },
            "pickup": "pickup",
            "pickupCoords": {
                "latitude": startLatitude,
                "longitude": startLongitude,
                "latitudeDelta": LONGITUDE_DELTA,
                "longitudeDelta": LATITUDE_DELTA
            },
            
        }

        

        navigation.navigate('LiveTracking', { details: data, userData: user })
    }

    const storeTripId = async (id) => {
        try {
            await AsyncStorage.setItem('tripId', id.toString());
            console.log('Data saved successfully!');
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    


    const renderItem = ({ item,index }) => {
        console.log('==>',item,index)
        return (
            <View style={style.cards}>
                {/* <ProgressBar style={{borderRadius:10}} progress={0.5} color={'blue'} /> */}
                <View style={style.headerContainer}> 
                    <Avatar.Icon color='#ddd' size={28} icon="account" />
                    <Text style={[style.headerText,{marginLeft:10}]}>{userData[index]?.name}(4.3)</Text>
                </View>
                <View style={style.topContainer}>
                    <View style={style.locationContainer}>
                        <View style={style.timeLine}>
                            <View style={style.circle}></View>
                            <View style={style.dottedLine}></View>
                            <View style={[style.circle, { backgroundColor: '#568203' }]}></View>
                        </View>
                        <View style={style.locationText}>
                            <Text numberOfLines={1} style={[style.text]}>{item?.pickUpLocation}</Text>
                            <View style={{ height: 26 }}></View>
                            <Text numberOfLines={1} style={[style.text]}>{item?.dropLocation}</Text>
                        </View>
                    </View>
                    <View style={style.rightContainer}>
                        <Text style={style.subHeaderText}>₹ {item?.amount}</Text>
                        {/* <Text style={[style.mediumText, { marginTop: 3 }]}> 333 m</Text> */}
                        {/* <Text style={style.mediumText}>5 min</Text> */}
                    </View>
                </View>
                <View style={style.bottomContainer}>
                    <TouchableOpacity onPress={()=>{declineRide(item)}} style={[style.button, {}]}>
                        <Text style={style.btnText}>Decline</Text>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={()=>{acceptRide(userData[index],cardData[index])}} style={[style.button, { backgroundColor: '#4CAF50', }]}>
                        <Text style={[style.btnText]}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View >
            {isLoading && <View style={style.indicatorContainer}><ActivityIndicator size={35} animating={true} color={'#fff'} /></View>}
            {renderedData.length > 0 && <FlatList
                data={renderedData}
                renderItem={renderItem}
                keyExtractor={(item) => item.tripId}
            />}
        </View>

    )
}

export default TripCard;