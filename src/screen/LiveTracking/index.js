import React, { useState, useRef, useEffect, } from 'react';
import { View, Dimensions, Text, Pressable, Image,Linking,BackHandler } from 'react-native';
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
import { patch } from '../../core/helper/services';
import AsyncStorage from '@react-native-async-storage/async-storage';


const GOOGLE_MAPS_API_KEY = REACT_APP_MAPS_API;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const LiveTracking = (props) => {

    const bottomSheetRef = useRef(null);
    const mapRef = useRef();
    const [snapPoints, setSnapPoints]=useState([175])
    const [tripDetails, setTripDetails] = useState('');
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();
    
    
    const [mapCoords, setMapCoords]=useState('');

    

    useEffect(() => {
        bottomSheetRef.current?.present();
        console.log(props.route.params.details);
        setTripDetails(props.route.params.details)
        setUserData(props.route.params.userData)
    }, []);

    const callSupport=()=>{
        Linking.openURL(`tel:${userData.phone}`)
    }

    const onCenter=()=>{
        mapRef.current.fitToCoordinates(mapCoords,{
            edgePadding: { top: 50, right: 20, bottom: 10, left: 30 },
            animated: true,
          });
    }

    const startTrip=()=>{
        
        setSnapPoints([100])
        const timeoutId= setTimeout(() => {
            setSnapPoints([175])
        }, 1000);

        return ()=>{
            clearTimeout(timeoutId)
        }
    }

    const endTrip=()=>{
        bottomSheetRef.current?.close();
        getTripId();
    }

    const changeTripStatus=async(tripId)=>{
        const payload={
            id:tripId,
            status:'5'
        }
        try {
            const data = await patch(payload, 'patchRequestVehicle');
            if (data) {
                console.log(data);
                navigation.replace('Rating',{tripData:tripDetails, userData:userData})        
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getTripId = async () => {
        try {
            const value = await AsyncStorage.getItem('tripId');
            if (value !== null) {
                changeTripStatus(value); 
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
      

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <View style={style.container}>
                    <View style={style.header}>
                        <TouchableOpacity onPress={callSupport}>
                            <Button mode='contained' textColor='#fff' style={{ backgroundColor: '#222' }}>Support</Button>
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
                        mapType={'terrain'}
                        showsMyLocationButton={false} >

                        <Marker
                            coordinate={tripDetails.dropCoords}>
                            <CustomMarker
                                headerText={''}
                                text={tripDetails.drop}
                                imgSrc={imagePath.dropMarker} />
                        </Marker>

                        <Marker
                            coordinate={tripDetails.pickupCoords}>
                            <CustomMarker
                                headerText={''}
                                text={null}
                                imgSrc={imagePath.truck} />
                        </Marker>


                        <MapViewDirections
                            origin={tripDetails.pickupCoords}
                            destination={tripDetails.dropCoords}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={3}
                            strokeColor='#666'
                            optimizeWaypoints={true}
                            onReady={result => {
                                mapRef.current.fitToCoordinates(result.coordinates,  {
                                    edgePadding: { top: 50, right: 20, bottom: 10, left: 30 },
                                    animated: true,
                                  });
                                setMapCoords(result.coordinates)  
                            }}
                        />

                    </MapView>
                    <View style={style.bottomContainer}>
                        <TouchableOpacity onPress={onCenter} style={style.onCenterContainer}  >
                            <Image source={imagePath.liveLocationBtn} />
                        </TouchableOpacity>
                    </View>

                    <BottomSheetModal
                        ref={bottomSheetRef}
                        index={0}
                        enablePanDownToClose={false}
                        enableContentPanningGesture={false}
                        backgroundStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#d6d6d6', elevation: 20 }}
                        snapPoints={snapPoints}>
                        <View style={style.bottomSheetPopup}>
                            <CurrentTripDetails startTrip={startTrip} endTrip={endTrip} userData={userData} data={tripDetails}/>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default LiveTracking;