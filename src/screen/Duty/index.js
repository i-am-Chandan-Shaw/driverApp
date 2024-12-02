import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Linking,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  AppState,
} from "react-native";
import {
  getAddressFromCoordinates,
  getCurrentLocation,
  locationPermission,
} from "../../core/helper/helper";
import MapView, { Marker, Circle } from "react-native-maps";
import LocationAccess from "../LocationAccess";
import imagePath from "../../constants/imagePath";
import style from "./style";
import CustomMarker from "../../core/component/CustomMarker";
import AppSwitch from "../../core/component/AppSwitch";
import { get, patch, post } from "../../core/helper/services";
import TripCard from "../../core/component/TripCard";
import notifee, { AndroidStyle } from "@notifee/react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoader from "../../core/component/AppLoader";
import { AppContext } from "../../core/helper/AppContext";
import messaging from "@react-native-firebase/messaging";
import { Snackbar } from "react-native-paper";
import { useTheme } from "../../constants/ThemeContext";
import useFontStyles from "../../constants/fontStyle";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Duty = () => {
  const { theme } = useTheme();
  const fontStyles = useFontStyles();

  const [locationAccessed, setLocationAccess] = useState(false);
  const [isDutyOn, setDuty] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("Unknown");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRideActive, setIsRideActive] = useState(false);
  const [activeRideData, setActiveRideData] = useState(null);
  const { globalData, setGlobalData } = useContext(AppContext);
  const [value, setValue] = useState(1);
  const navigation = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);
  const [snackBarText, setSnackBarText] = useState(
    "Oops !! Something went wrong."
  );
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const [isModalVisible, setIsModalVisible] = useState(true);

  const mapRef = useRef();
  let timeout;
  let waitForTripStatus;

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (globalData.driverData.id && updateDriver) {
        const activeState = nextAppState === "active" ? 1 : 0;
        const payload = {
          id: globalData.driverData.id,
          active: activeState,
        };
        updateDriver(payload);
        console.log("App State changed to:", nextAppState);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [globalData, updateDriver]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    getUserLocation(false);
    getDeviceToken();
    getTripId();
  };

  

  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log(token);

        const payload = {
          id: globalData?.driverData.id,
          pushToken: token,
        };
        updateDriver(payload);
      }
    } catch (error) {
      console.log("Error fetching device token:", error);
    }
  };

  const updateDriver = async (payload) => {
    try {
      const data = await patch(payload, "patchDriver");
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log("updateDriver", error);
    }
  };

  const changeValue = () => {
    setValue((prev) => {
      return prev + 1;
    });
  };

  const checkForActiveTrip = async (id) => {
    const queryParameter = "?tripId=" + id.toString();
    try {
      const data = await get("getRequestVehicle", queryParameter);
      if (data) {
        console.log(data, "==>", globalData.driverData.id);
        setActiveRideData(data[0]);
        if (
          (data[0].status == 2 || data[0].status == 4) &&
          globalData.driverData.id == data.driverId
        ) {
          setIsRideActive(true);
        } else {
          clearInterval(waitForTripStatus);
          setIsRideActive(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("getTripStatus", error);
      clearInterval(waitForTripStatus);
      setIsLoading(false);
    }
  };

  const getTripId = async () => {
    try {
      setIsLoading(true);
      const id = await AsyncStorage.getItem("tripId");
      if (id !== null) {
        waitForTripStatus = setInterval(() => {
          checkForActiveTrip(id);
        }, 3000);
      } else {
        console.log("Data not found!");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
      setIsLoading(false);
      return false;
    }
  };

  const trackLive = () => {
    let trip = activeRideData;
    if (trip) {
      const startLatitude = trip.pickUpCoords.pickUpLat;
      const startLongitude = trip.pickUpCoords.pickUpLng;
      const destinationLatitude = trip.dropCoords.dropLat;
      const destinationLongitude = trip.dropCoords.dropLng;
      const LATITUDE_DELTA = 0.0122;
      const LONGITUDE_DELTA = 0.0061627689429373245;

      let data = {
        drop: "Drop",
        dropCoords: {
          latitude: parseFloat(destinationLatitude),
          longitude: parseFloat(destinationLongitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        pickup: "pickup",
        pickupCoords: {
          latitude: parseFloat(startLatitude),
          longitude: parseFloat(startLongitude),
          latitudeDelta: LONGITUDE_DELTA,
          longitudeDelta: LATITUDE_DELTA,
        },
      };

      clearInterval(waitForTripStatus);
      navigation.navigate("LiveTracking", {
        coordinates: data,
        tripData: trip,
      });
    }
  };

  useEffect(() => {
    if (isDutyOn) {
      findTrips();
    } else {
      setAvailableTrips([]);
    }
  }, [isDutyOn, value]);

  const findTrips = () => {
    timeout = setTimeout(() => {
      getActiveRides();
    }, 6000);
  };

  const toggleSwitch = () => {
    setDuty((previousState) => {
      clearTimeout(timeout);
      return !previousState;
    });
  };

  const getActiveRides = async () => {
    let driverCoords = {
      id: globalData?.id,
      driverCoordinates: {
        lat: currentLocation?.latitude,
        lng: currentLocation?.longitude,
      },
    };

    try {
      const data = await post(driverCoords, "getAvailableRides");
      if (data) {
        setAvailableTrips(data);
        clearTimeout(timeout);
      }
    } catch (error) {
      console.log("getActiveRides=>", error);
      changeValue();
    }
  };

  const getUserLocation = async (openSettings) => {
    openSettings = openSettings ? true : openSettings;
    try {
      setLocationAccess(false);
      const status = await locationPermission();
      if (status === "granted") {
        setLocationAccess(true);
        const { latitude, longitude } = await getCurrentLocation();
        if (latitude && longitude) {
          let currAdd = await getAddressFromCoordinates(latitude, longitude);
          setCurrentAddress(currAdd);
        }
        // animate(latitude, longitude);
        setCurrentLocation(() => {
          let coords = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

          let payload = {
            id: globalData?.driverData.id,
            currentLocation: {
              lat: latitude.toString(),
              lng: longitude.toString(),
            },
            active: 1,
          };
          updateDriver(payload);
          setGlobalData("currentLocation", coords);
          return coords;
        });
      }
    } catch (error) {
      setLocationAccess(false);
      console.log(error);
      if (openSettings) Linking.openSettings();
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const updatedData = (data, type) => {
    setAvailableTrips(data);
    if (type == "declined") {
      findTrips();
    } else if (type == "invalid") {
      setSnackBarText(
        "Oops! Some other driver already accepted the request. Try the next trip !"
      );
      setVisible(true);
      findTrips();
    } else if (type == "others") {
      setSnackBarText("Oops ! Something went wrong.");
      setVisible(true);
      findTrips();
    }
  };

  const displayNotification = async () => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    await notifee.displayNotification({
      title: "New rides are in!",
      body: "Open the app to start driving. Let's hit the road! 🚗",
      android: {
        channelId,
        style: {
          type: AndroidStyle.BIGTEXT,
          text: "Open the app to start driving. Let's hit the road! 🚗",
        },
        smallIcon: "location", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
          title: "Start",
        },
      },
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View>
      {locationAccessed && (
        <View style={style.container}>
          {isRideActive && (
            <View style={style.navContainer}>
              <Text style={{ fontSize: 15, color: "#fff" }}>
                You currently have an active trip !
              </Text>
              <Pressable style={style.viewButton} onPress={trackLive}>
                <Text
                  style={{ fontSize: 13, fontWeight: "500", color: "#000" }}
                >
                  View
                </Text>
              </Pressable>
            </View>
          )}
          {!isRideActive && (
            <View style={style.dutyContainer}>
              <AppSwitch toggleSwitch={toggleSwitch} />
            </View>
          )}
          {isLoading && <AppLoader styles={{ top: 300 }} />}
          {!isDutyOn && (
            <View
              style={[
                style.waitingContainer,
                { backgroundColor: theme.bgLight },
              ]}
            >
              <Image style={style.image} source={imagePath.van} />
              <Text style={[fontStyles.fnt16Medium]}>
                Go ON DUTY to start earning !{" "}
              </Text>
            </View>
          )}
          {/* On Duty */}

          {/* Trip Cards */}

          {isDutyOn && availableTrips.length > 0 && (
            <View style={style.cardsContainer}>
              <TripCard
                sendData={updatedData}
                cardData={availableTrips}
              ></TripCard>
            </View>
          )}

          {/* <WebViewBanner
                    visible={isModalVisible}
                    onClose={toggleModal}
                    contentUrl="https://reactnative.dev/docs/running-on-device"
                /> */}

          {/* Map */}
          {isDutyOn && (
            <MapView
              ref={mapRef}
              style={style.mapContainer}
              initialRegion={currentLocation}
              toolbarEnabled={false}
              loadingEnabled={false}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onMapLoaded={() => {}}
            >
              {currentLocation && (
                <View>
                  <Circle
                    center={currentLocation}
                    radius={20000}
                    strokeWidth={2}
                    strokeColor={"#aaa"}
                    fillColor="rgba(255,232,255,0.4)"
                  />
                  <Marker coordinate={currentLocation}>
                    <CustomMarker
                      headerText={"Current Location:"}
                      text={currentAddress}
                      imgSrc={imagePath.pickupMarker}
                    />
                  </Marker>
                </View>
              )}
            </MapView>
          )}

          {/* Center Button */}
          {currentLocation && isDutyOn && (
            <View style={style.bottomContainer}>
              <TouchableOpacity
                style={style.onCenterContainer}
                onPress={onCenter}
              >
                <Image source={imagePath.liveLocationBtn} />
              </TouchableOpacity>
              <Snackbar
                style={style.snackBar}
                visible={visible}
                duration={4000}
                onDismiss={onDismissSnackBar}
                action={{
                  label: "OK",
                  labelStyle: { color: "#fff" },
                  onPress: () => {
                    // Do something
                  },
                }}
              >
                {snackBarText}
              </Snackbar>
            </View>
          )}
        </View>
      )}
      {!locationAccessed && <LocationAccess onPress={getUserLocation} />}
    </View>
  );
};

export default Duty;
