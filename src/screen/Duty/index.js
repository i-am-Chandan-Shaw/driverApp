import React, { useEffect, useRef, useState } from 'react';
import { View, Linking, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { getAddressFromCoordinates, getCurrentLocation, locationPermission } from '../../core/helper/helper';
import MapView, { Marker, Circle } from 'react-native-maps';
import LocationAccess from '../LocationAccess';
import imagePath from '../../constants/imagePath';
import style from './style';
import CustomMarker from '../../core/component/CustomMarker';
import AppSwitch from '../../core/component/AppSwitch';
import { get, patch, post } from '../../core/helper/services';
import TripCard from '../../core/component/TripCard';
import notifee,{ AndroidStyle } from '@notifee/react-native';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Duty = () => {
    const [locationAccessed, setLocationAccess] = useState(false);
    const [userData, setUserData] = useState([]);
    const [isDutyOn, setDuty] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Unknown')
    const [currentLocation, setCurrentLocation] = useState(null);
    const [availableTrips, setAvailableTrips] = useState([]);
    const [value, setValue] = useState(1);
    const mapRef = useRef();
    let timeout;

    useEffect(() => {
        getUserLocation(false);
    }, []);

    const changeValue = () => {
        setValue((prev) => {
            return prev + 1
        })
    }



    useEffect(() => {
        if (isDutyOn) {
            findTrips();
        } else {
            setAvailableTrips([])
            setUserData([]);
        }
    }, [isDutyOn, value])

    const findTrips = () => {
        timeout = setTimeout(() => {
            getActiveRides();
        }, 3000);

    }

    const toggleSwitch = () => {
        setDuty((previousState) => {
            clearTimeout(timeout)
            return !previousState;
        });
    }

    const getActiveRides = async () => {
        let driverCoords = {
            "driverCoordinates": {
                "lat": currentLocation?.latitude,
                "lng": currentLocation?.longitude
            }
        }

        try {
            const data = await post(driverCoords, 'getAvailableRides');
            if (data) {
                setUserDetails(data);
                setAvailableTrips(data);
                clearTimeout(timeout);
                displayNotification();
            }
        } catch (error) {
            console.log('getActiveRides=>', error);
            changeValue()
        }
    }

    const getUserLocation = async (openSettings) => {
        openSettings = openSettings ? true : openSettings;
        try {
            setLocationAccess(false);
            const status = await locationPermission();
            if (status == 'granted') {
                setLocationAccess(true);
                const { latitude, longitude } = await getCurrentLocation();
                if (latitude && longitude) {
                    let currAdd = await getAddressFromCoordinates(latitude, longitude);
                    setCurrentAddress(currAdd)

                }
                // animate(latitude, longitude);
                setCurrentLocation(() => {
                    return ({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    })
                })
            }
        } catch (error) {
            setLocationAccess(false);
            console.log(error);
            if (openSettings)
                Linking.openSettings()
        }
    }

    const setUserDetails = (data) => {
        data.forEach(element => {
            getUserDetails(element.userId);
        });
        console.log(userData.length, availableTrips.length);
    }

    const getUserDetails = async (id) => {
        const queryParameter = '?userId=' + id.toString()
        try {
            const data = await get('getUser', queryParameter);
            if (data) {
                setUserData((prevData) => {
                    return [...prevData, data[0]]
                })
            }
        } catch (error) {
            console.log('getUserDetails', error);
        }
    }



    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        });
        // openGoogleMapsDirections(startLatitude, startLongitude, destinationLatitude, destinationLongitude)
    };




    const openGoogleMapsDirections = (startLat, startLng, destLat, destLng) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}`;
        Linking.openURL(url);
    };

    const updatedData = (data, type) => {
        setAvailableTrips(data);
        setUserData(data);
        if (type == 'declined') {
            findTrips();
        } else if (type == 'accepted') {
            setDuty(false)
        }
    }

    const displayNotification=async()=>{
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });
        await notifee.displayNotification({
            title: 'New rides are in!',
            body: 'Main body content of the notification',
            android: {
              channelId,
              style: { type: AndroidStyle.BIGTEXT, text: 'Open the app to start driving. Let\'s hit the road! 🚗' },
              smallIcon: 'location', // optional, defaults to 'ic_launcher'.
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
                title:'Start'
              },
            },
          });
    }


    return (
        <View>
            {locationAccessed && <View style={style.container}>
                <View style={style.dutyContainer}>
                    <AppSwitch toggleSwitch={toggleSwitch} />
                </View>
                {!isDutyOn && <View style={style.waitingContainer}>
                    <Image style={style.image} source={imagePath.van} />
                    <Text style={style.mediumText}>Go ON DUTY to start earning !</Text>
                </View>}
                {/* On Duty */}

                {/* Trip Cards */}

                {(isDutyOn && (availableTrips?.length == userData?.length) && availableTrips.length > 0) && <View style={style.cardsContainer}>
                    <TripCard sendData={updatedData} userData={userData} cardData={availableTrips}></TripCard>
                </View>}

                {/* Map */}
                {isDutyOn && (<MapView ref={mapRef} style={style.mapContainer}
                    initialRegion={currentLocation}
                    toolbarEnabled={false}
                    loadingEnabled={true}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    onMapLoaded={() => {

                    }} >

                    {currentLocation &&
                        <View>
                            <Circle center={currentLocation}
                                radius={4000}
                                strokeWidth={2}
                                strokeColor={'#aaa'}
                                fillColor='rgba(255,232,255,0.4)'
                            />
                            <Marker
                                coordinate={currentLocation}>
                                <CustomMarker
                                    headerText={'Current Location:'}
                                    text={currentAddress}
                                    imgSrc={imagePath.pickupMarker} />
                            </Marker>
                        </View>
                    }



                </MapView>)}

                {/* Center Button */}
                {(currentLocation && isDutyOn) && <View style={style.bottomContainer}>
                    <TouchableOpacity style={style.onCenterContainer} onPress={onCenter} >
                        <Image source={imagePath.liveLocationBtn} />
                    </TouchableOpacity>
                </View>}
            </View>}
            {!locationAccessed && <LocationAccess onPress={getUserLocation} />}
        </View>
    )
}

export default Duty;