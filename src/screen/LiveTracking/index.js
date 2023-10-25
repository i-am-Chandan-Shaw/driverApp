import React, { useState, useRef, useEffect, useContext, } from 'react';
import { View, Dimensions, Text, Pressable, Image, Linking, BackHandler, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import MapViewDirections from 'react-native-maps-directions';
import { REACT_APP_MAPS_API } from '@env';
import CustomMarker from '../../core/component/CustomMarker';
import imagePath from '../../constants/imagePath';
import style from './style';
import { Button } from 'react-native-paper';
import CurrentTripDetails from '../../core/View/CurrentTripDetails';
import { useNavigation } from '@react-navigation/native';
import { get, patch } from '../../core/helper/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpValidator from '../../core/component/OtpValidator';
import AppLoader from '../../core/component/AppLoader';
import { AppContext } from '../../core/helper/AppContext';
import { getCurrentLocation, locationPermission } from '../../core/helper/helper';


const GOOGLE_MAPS_API_KEY = REACT_APP_MAPS_API;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;




const LiveTracking = (props) => {

    const bottomSheetRef = useRef(null);
    const mapRef = useRef();
    const [snapPoints, setSnapPoints] = useState([175])
    const [coordinates, setCoordinates] = useState('');
    const [receivedCoords, setReceivedCoords] = useState(null)
    const [tripData, setTripData] = useState(null);
    const navigation = useNavigation();
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { globalData, setGlobalData } = useContext(AppContext);
    const [tripStatus, setTripStatus] = useState({
        isStarted: false,
        isEnded: false
    });
    let tripInterval;


    const [mapCoords, setMapCoords] = useState('');

    const markerRef = useRef();

    useEffect(() => {
        bottomSheetRef.current?.present();
        setReceivedCoords(props.route.params.coordinates);
        setTripData(props.route.params.tripData);
        let interval = setInterval(() => {
            getLiveLocation();
        }, 6000)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCoordinates({
            pickupCoords: globalData.currentLocation,
            dropCoords: receivedCoords?.pickupCoords,
            drop: 'Pickup Location'
        })
    }, [receivedCoords]);


    useEffect(() => {
        if (tripData?.status == 4) {
            setTripStatus((prevStatus) => {
                prevStatus.isStarted = true
                return prevStatus;
            });
        }
        let tripInterval = setInterval(() => {
            console.log('sasaa', tripData?.tripId)
            getTripStatus(tripData?.tripId)

        }, 6000);
        return () => clearInterval(tripInterval);
    }, [tripData]);

    const getTripStatus = async (id) => {
        const queryParameter = '?tripId=' + id.toString()
        try {
            const data = await get('getRequestVehicle', queryParameter);
            if (data) {
                if (data[0].status == 5) {
                    clearInterval(tripInterval);
                    navigation.replace('Rating', { tripData: coordinates, tripData: tripData });
                }
                else if (data[0].status > 5) {
                    clearInterval(tripInterval);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
            }
        } catch (error) {
            console.log('getTripStatus', error);
        }
    }

    const getLiveLocation = async () => {
        try {
            const status = await locationPermission()
            if (status == 'granted') {
                const { latitude, longitude } = await getCurrentLocation();
                updateCurrentLoc(globalData?.driverData[0].id, latitude, longitude);
                animate(latitude, longitude);

            }
        } catch (error) {
            console.log(error);
        }

    }

    const updateCurrentLoc = async (driverId, lat, lng) => {
        const payload = {
            id: driverId,
            lat: lat,
            lng: lng
        }
        try {
            const data = await patch(payload, 'patchDriver');
            if (data) {
                console.log(data);
            }
        } catch (error) {
            console.log('update current doc error', error);
        }
    }

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000)
            }
        } else {
            state.coordinate.timing(newCoordinate).start()
        }
    }

    const cancelRide = () => {
        // Linking.openURL(`tel:${tripData.phone}`)
        getTripId(7)
    }

    const closingOTPModal = async (value) => {
        setShowOtpModal(false)
        if (value == 'accepted') {
            setIsLoading(true);
            setCoordinates({
                pickupCoords: globalData.currentLocation,
                dropCoords: receivedCoords?.dropCoords,
                drop: 'Pickup Location'
            })
            const payload = {
                id: tripData?.tripId,
                status: 4
            }
            try {
                const data = await patch(payload, 'patchRequestVehicle');
                if (data) {
                    setTripStatus((prevStatus) => {
                        prevStatus.isStarted = true
                        return prevStatus;
                    });
                    setIsLoading(false)
                }
            } catch (error) {
                console.log(error);

            }

        }
    }

    const openGoogleMapsDirections = (startLat, startLng, destLat, destLng) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}`;
        Linking.openURL(url);
    };

    const onCenter = () => {
        mapRef.current.fitToCoordinates(mapCoords, {
            edgePadding: { top: 50, right: 20, bottom: 10, left: 30 },
            animated: true,
        });
    }

    const startTrip = () => {
        setShowOtpModal(true)
    }

    const endTrip = () => {
        getTripId(5);
        removeTripId();
    }

    const changeTripStatus = async (tripId, statusValue) => {
        // status value 5 for completed
        // status value 7 for cancelled by driver
        const payload = {
            id: tripId,
            status: statusValue.toString()
        }
        try {
            const data = await patch(payload, 'patchRequestVehicle');
            if (data) {
                if (statusValue == 5)
                    navigation.replace('Rating', { tripData: coordinates, tripData: tripData });
                else if (statusValue == 7) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getTripId = async (statusValue) => {
        try {
            const id = await AsyncStorage.getItem('tripId');
            if (id !== null) {
                changeTripStatus(id, statusValue);
            } else {
                console.log('Data not found!');
                return false
            }
        } catch (error) {
            console.log('Error retrieving data:', error);
            return false
        }
    }

    const removeTripId = async () => {
        try {
            await AsyncStorage.removeItem('tripId');
            console.log('Data removed successfully!');
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    useEffect(() => {
        // Add event listener for hardware back button (Android) or back navigation gesture (iOS)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Clean up the event listener when the component is unmounted
        return () => backHandler.remove();
    }, []);


    const handleBackPress = () => {
        // Return true to prevent the default behavior (going back)
        return true;
    };

    const openGoogleMap = () => {
        openGoogleMapsDirections(coordinates.pickupCoords.latitude, coordinates.pickupCoords.longitude, coordinates.dropCoords.latitude, coordinates.dropCoords.longitude)
    }


    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                {isLoading && <AppLoader styles={{ top: 300 }} />}
                <View style={style.container}>
                    <OtpValidator visible={showOtpModal} expectedOtp={tripData?.otp} onClose={closingOTPModal} />
                    <View style={style.header}>
                        <TouchableOpacity onPress={cancelRide}>
                            <Button mode='contained' textColor='#fff' style={{ backgroundColor: '#333' }}>Cancel</Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCenter} style={{ marginTop: 10 }} >
                            <Image source={imagePath.liveLocationBtn} />
                        </TouchableOpacity>

                    </View>
                    <MapView ref={mapRef} style={style.mapContainer}
                        initialRegion={{
                            latitude: 22.5629,
                            longitude: 88.3962,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        toolbarEnabled={false}
                        loadingEnabled={false}
                        showsUserLocation={false}
                        mapType={'standard'}
                        showsMyLocationButton={false} >

                        <Marker
                            coordinate={coordinates.dropCoords}>
                            <CustomMarker
                                headerText={''}
                                text={coordinates.drop}
                                imgSrc={imagePath.dropMarker} />
                        </Marker>

                        <Marker.Animated ref={markerRef}
                            coordinate={coordinates.pickupCoords}>
                            <CustomMarker
                                headerText={''}
                                text={null}
                                imgSrc={imagePath.truck} />
                        </Marker.Animated>


                        <MapViewDirections
                            origin={coordinates.pickupCoords}
                            destination={coordinates.dropCoords}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={3}
                            strokeColor='#666'
                            optimizeWaypoints={true}
                            onReady={result => {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                    animated: true,
                                });
                                setMapCoords(result.coordinates)
                            }}
                        />

                    </MapView>
                    <View style={style.bottomContainer}>

                        <View style={style.navContainer}>
                            <Text style={{ fontSize: 13, color: '#fff' }}>Open Google Maps for better navigation !</Text>
                            <Pressable style={style.viewButton} onPress={openGoogleMap}>
                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>Open</Text>
                            </Pressable>
                        </View>
                    </View>


                    <BottomSheetModal
                        ref={bottomSheetRef}
                        index={0}
                        enablePanDownToClose={false}
                        enableContentPanningGesture={false}
                        backgroundStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#d6d6d6', elevation: 20 }}
                        snapPoints={snapPoints}>
                        <View style={style.bottomSheetPopup}>
                            <CurrentTripDetails
                                startTrip={startTrip}
                                endTrip={endTrip}
                                tripData={tripData}
                                isStarted={tripStatus.isStarted}
                                isEnded={tripStatus.isEnded}
                                data={coordinates} />
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default LiveTracking;