import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Dimensions,
  Linking,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  handleLocationPermission,
  fetchAndPrepareLocationData,
} from "../../core/helper/locationHelper";
import LocationAccess from "../LocationAccess";
import { AppContext } from "../../core/helper/AppContext";
import { get, patch, post } from "../../core/helper/services";
import style from "./style";
import AppSwitch from "../../core/component/AppSwitch";
import AppLoader from "../../core/component/AppLoader";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../constants/ThemeContext";
import imagePath from "../../constants/imagePath";
import commonStyles from "../../constants/commonStyle";
import MapView, { Circle, Marker } from "react-native-maps";
import CustomMarker from "../../core/component/CustomMarker";
import TripCard from "../../core/component/TripCard";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Duty = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { globalData, setGlobalData } = useContext(AppContext);

  const mapRef = useRef();
  const [availableTrips, setAvailableTrips] = useState([]);
  const [hasActiveTrip, setHasActiveTrip] = useState(false);
  const [activeTripData, setActiveTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [locationState, setLocationState] = useState({
    locationAccess: false,
    currentLocation: null,
    currentAddress: "",
  });

  // -------------------------- Location Access Logic ------------------------------ //

  useEffect(() => {
    fetchUserLocation();
    getTripStatus();
  }, []);

  const getTripStatus = async () => {
    if (!globalData.driverData) {
      return null;
    }

    setIsLoading(true);
    const queryParameter = `?tripId=${globalData?.driverData.lastTrip}`;
    try {
      const trip = await get("getRequestVehicle", queryParameter);
      if (trip[0]) {
        setActiveTripData(trip[0]);
        const tripStatus = trip[0].status;
        if (tripStatus == 2 || tripStatus == 4) {
          setHasActiveTrip(true);
        } else {
        }
      }
    } catch (error) {
      console.error("Error fetching trip status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLocation = async (shouldOpenSettings = false) => {
    try {
      setLocationState((prevState) => ({
        ...prevState,
        locationAccess: false,
      }));

      const hasPermission = await handleLocationPermission(shouldOpenSettings);

      if (!hasPermission) return;

      setLocationState((prevState) => ({ ...prevState, locationAccess: true }));

      const locationData = await fetchAndPrepareLocationData();
      if (!locationData) return;

      const { coordinates, address } = locationData;

      const driverDetailsPayload = {
        id: globalData?.driverData?.id,
        currentLocation: {
          lat: coordinates.latitude.toString(),
          lng: coordinates.longitude.toString(),
        },
        active: 1,
      };

      updateDriverDetails(driverDetailsPayload);

      setGlobalData("currentLocation", coordinates);

      setLocationState((prevState) => ({
        ...prevState,
        currentLocation: coordinates,
        currentAddress: address,
      }));
    } catch (error) {
      console.error("Error fetching user location:", error);
      setLocationState((prevState) => ({
        ...prevState,
        locationAccess: false,
      }));
      if (shouldOpenSettings) Linking.openSettings();
    }
  };

  const updateDriverDetails = async (payload) => {
    setIsLoading(true);
    try {
      const response = await patch(payload, "patchDriver");
      if (response) {
        console.log("Driver updated successfully:", response);
      } else {
        console.warn("No response received from the server.");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------- Get Active Rides Logic ------------------------------ //

  const delayFetchRef = useRef(false);

  const getActiveRides = useCallback(async () => {
    if (!globalData?.driverData?.id || !locationState.currentLocation) {
      console.warn(
        "Driver data or location is missing. Cannot fetch active rides."
      );
      return;
    }

    const driverPayload = {
      id: globalData.driverData.id,
      driverCoordinates: {
        lat: locationState.currentLocation.latitude,
        lng: locationState.currentLocation.longitude,
      },
    };

    try {
      const response = await post(driverPayload, "getAvailableRides");
      if (response && response.length > 0) {
        console.log("Fetched available trips:", response);
        setAvailableTrips(response);
      } else {
        console.log("No active trips available.");
        setAvailableTrips([]);
      }
    } catch (error) {
      console.error("Error fetching active rides:", error);
    }
  }, [globalData?.driverData?.id, locationState.currentLocation]);

  useEffect(() => {
    let intervalId;

    const pollRides = async () => {
      if (availableTrips.length === 0 && !delayFetchRef.current) {
        await getActiveRides();
      } else if (availableTrips.length > 0) {
        clearInterval(intervalId);
      }
    };

    if (isOnDuty) {
      pollRides();
      intervalId = setInterval(() => pollRides(), 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnDuty, availableTrips, getActiveRides]);

  const toggleDuty = () => {
    setIsOnDuty((prevState) => {
      const newState = !prevState;
      if (!newState) setAvailableTrips([]);
      return newState;
    });
  };

  const updateTripStatus = () => {
    setAvailableTrips([]);
    delayFetchRef.current = true;
    setTimeout(() => {
      delayFetchRef.current = false;
      if (isOnDuty) {
        getActiveRides();
      }
    }, 5000);
  };

  // -------------------------- Other components Logic ------------------------------ //

  const animateToCurrentLocation = () => {
    mapRef.current.animateToRegion({
      latitude: locationState.currentLocation.latitude,
      longitude: locationState.currentLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const viewActiveTrip = () => {
    navigation.replace("LiveTracking", { tripData: activeTripData });
  };

  return (
    <View>
      {!locationState.locationAccess && (
        <LocationAccess onPress={fetchUserLocation} />
      )}
      {locationState.locationAccess && (
        <View style={style.container}>
          {isLoading && <AppLoader />}
          {!hasActiveTrip && (
            <View style={style.dutyContainer}>
              <AppSwitch toggleSwitch={toggleDuty} />
            </View>
          )}
          {isOnDuty ? (
            <View>
              {/* Showing available trip */}
              {availableTrips.length > 0 && (
                <View style={style.cardsContainer}>
                  <TripCard
                    sendData={updateTripStatus}
                    cardData={availableTrips}
                  ></TripCard>
                </View>
              )}
              {/* Showing available trip */}

              <MapView
                ref={mapRef}
                style={style.mapContainer}
                initialRegion={locationState.currentLocation}
                toolbarEnabled={false}
                loadingEnabled={false}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onMapLoaded={() => {}}
              >
                {locationState.currentLocation && (
                  <View>
                    <Circle
                      center={locationState.currentLocation}
                      radius={22000}
                      strokeWidth={2}
                      strokeColor={"#aaa"}
                      fillColor="rgba(255,232,255,0.4)"
                    />
                    <Marker coordinate={locationState.currentLocation}>
                      <CustomMarker
                        headerText={"Current Location:"}
                        text={locationState.currentAddress}
                        imgSrc={imagePath.pickupMarker}
                      />
                    </Marker>
                  </View>
                )}
              </MapView>
              <View style={style.bottomContainer}>
                <TouchableOpacity
                  style={style.onCenterContainer}
                  onPress={animateToCurrentLocation}
                >
                  <Image source={imagePath.liveLocationBtn} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={[
                style.waitingContainer,
                { backgroundColor: theme.bgLight },
              ]}
            >
              <Image style={style.image} source={imagePath.duty} />
              <Text style={[commonStyles.fnt16Medium]}>
                {hasActiveTrip
                  ? "You have an active trip !"
                  : "Go ON DUTY to start earning !"}
              </Text>
              {hasActiveTrip && (
                <TouchableOpacity
                  onPress={viewActiveTrip}
                  style={[
                    commonStyles.btnSuccess,
                    commonStyles.btnSmall,
                    { marginTop: 8, width: 120 },
                  ]}
                >
                  <Text
                    style={[
                      commonStyles.fnt16Medium,
                      commonStyles.textCenter,
                      commonStyles.textWhite,
                    ]}
                  >
                    View Trip
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Duty;
