import React, { useEffect, useRef, useState } from 'react';
import { View, Linking, Dimensions, Image, Text, Switch, TouchableOpacity,Alert } from 'react-native';
import { getAddressFromCoordinates, getCurrentLocation, locationPermission } from '../../core/helper/helper';
import MapView, { Marker, AnimatedRegion, Circle } from 'react-native-maps';
import LocationAccess from '../LocationAccess';
import { REACT_APP_MAPS_API } from '@env';
import imagePath from '../../constants/imagePath';
import style from './style';
import CustomMarker from '../../core/component/CustomMarker';


const GOOGLE_MAPS_API_KEY = REACT_APP_MAPS_API;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Duty = () => {
    const [locationAccessed, setLocationAccess] = useState(false);
    const [isDutyOn, setDuty] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Unknown')
    const [currentLocation, setCurrentLocation] = useState(null);
    const mapRef = useRef();

    useEffect(() => {
        getUserLocation(false);
    }, []);

    const toggleSwitch = () => setDuty((previousState) => {
        console.log(previousState);
        return !previousState;
    });

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

    

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        });
    };


    return (
        <View>
            {locationAccessed && <View style={style.container}>
                <View style={[isDutyOn ? style.dutyOnContainer : style.dutyOffContainer]}>
                    <Text style={{ fontSize: 16, color: isDutyOn ? '#22DD22' : '#222' }}>{isDutyOn ? 'ON DUTY' : 'OFF DUTY'}</Text>
                    <View style={{ marginLeft: 10, }}>
                        <Switch
                            trackColor={{ false: '#aaa', true: '#65a765' }}
                            thumbColor={isDutyOn ? '#90ee90' : '#444'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isDutyOn}
                        />
                    </View>
                </View>
                {!isDutyOn && <View style={style.waitingContainer}>
                    <Image style={style.image} source={imagePath.van} />
                    <Text style={style.mediumText}>Go ON DUTY to start earning !</Text>
                </View>}
                {/* On Duty */}
                {isDutyOn &&  (<MapView ref={mapRef} style={style.mapContainer}
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