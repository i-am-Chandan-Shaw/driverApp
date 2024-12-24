import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import MapViewDirections from "react-native-maps-directions";
import { REACT_APP_MAPS_API } from "@env";
import CustomMarker from "../../core/component/CustomMarker";
import imagePath from "../../constants/imagePath";
import style from "./style";
import CurrentTripDetails from "../../core/View/CurrentTripDetails";
import { useNavigation } from "@react-navigation/native";
import { get, patch } from "../../core/helper/services";
import AppLoader from "../../core/component/AppLoader";
import { AppContext } from "../../core/helper/AppContext";
import {
  fetchAndPrepareLocationData,
  getInitialRegionForMap,
} from "../../core/helper/locationHelper";
import { convertMinToHours } from "../../core/helper/commonHelper";
import { useTheme } from "../../constants/ThemeContext";

const GOOGLE_MAPS_API_KEY = REACT_APP_MAPS_API;
const { height } = Dimensions.get("window");

const UPDATE_INTERVAL = 8000;
const initialRegion = getInitialRegionForMap();

const LiveTracking = (props) => {
  const { theme } = useTheme();

  const mapRef = useRef();
  const markerRef = useRef();
  const bottomSheetRef = useRef();
  const { globalData } = useContext(AppContext);

  const [currentTrip, setCurrentTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const snapPoints = [320, height - 200];
  const [mapDirectionResult, setMapDirectionResult] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    currentLocation: null,
    dropLocation: null,
    travelDuration: null,
    distanceLeft: null,
    hasTripStarted: false,
    locationType: "pickup location",
  });
  const navigation = useNavigation();

  const initializeMapDirectionPoints = (tripData) => {
    if (!tripData) {
      return null;
    }
    const tripStarted = tripData.status == 4;

    console.log(locationDetails.hasTripStarted);

    const endLat = tripStarted
      ? parseFloat(tripData.dropCoords.dropLat)
      : parseFloat(tripData.pickUpCoords.pickUpLat);

    const endLng = tripStarted
      ? parseFloat(tripData.dropCoords.dropLng)
      : parseFloat(tripData.pickUpCoords.pickUpLng);

    const updatedLocationType = tripStarted
      ? "drop location"
      : "pickup location";

    const endLocation = {
      latitude: endLat,
      longitude: endLng,
    };

    setLocationDetails((prevState) => ({
      ...prevState,
      dropLocation: endLocation,
      locationType: updatedLocationType,
    }));
  };

  // -------------------------- Location Access and Trip Status Checking Logic ------------------------------ //

  const fetchCurrentLocationAndUpdate = useCallback(async () => {
    try {
      const locationData = await fetchAndPrepareLocationData();
      if (!locationData) return;

      const { coordinates } = locationData;

      if (globalData.driverData) {
        await updateTripLocationDetails(coordinates);
      }
      setLocationDetails((prevState) => {
        // animateMarkerMovement(coordinates.latitude, coordinates.longitude);
        return {
          ...prevState,
          currentLocation: coordinates,
        };
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }, []);

  const updateTripLocationDetails = async (coordinates) => {
    if (!currentTrip) {
      return null;
    }
    const payload = {
      id: currentTrip?.tripId,
      driverLat: coordinates.latitude.toString(),
      driverLng: coordinates.longitude.toString(),
    };

    const endPoint = "patchRequestVehicle";
    try {
      const data = await patch(payload, endPoint);
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log("update current location error", error);
    }
  };

  const getTripStatus = useCallback(async () => {
    if (!currentTrip) {
      return null;
    }
    const queryParameter = `?tripId=${currentTrip?.tripId}`;
    try {
      const trip = await get("getRequestVehicle", queryParameter);
      if (trip[0]) {
        const tripStatus = trip[0].status;
        console.log(tripStatus);

        if (parseInt(tripStatus) === 6) {
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          Alert.alert("Ride cancelled", "Ride was cancelled by the user !", [
            {
              text: "OK",
              onPress: () => {},
            },
          ]);
        }
        if (parseInt(tripStatus) === 4) {
          setCurrentTrip(trip[0]);

          initializeMapDirectionPoints(trip[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching trip status:", error);
    }
  }, [currentTrip?.tripId, navigation]);

  // -------------------------- Initialization Logic ------------------------------ //
  useEffect(() => {
    setIsLoading(true);
    onInitialLoad();
    const updateInterval = setInterval(() => {
      fetchCurrentLocationAndUpdate();
      getTripStatus();
    }, UPDATE_INTERVAL);

    return () => clearInterval(updateInterval);
  }, [fetchCurrentLocationAndUpdate, getTripStatus]);

  const onInitialLoad = () => {
    if (props?.route.params.tripData) {
      setCurrentTrip(props.route.params.tripData);
    } else {
      getTripStatus();
    }
    initializeMapDirectionPoints(currentTrip);
  };

  const animateMarkerMovement = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 8000);
      }
    } else {
      state.coordinate.timing(newCoordinate).start();
    }
  };

  const onMapReady = (mapData) => {
    mapRef.current.fitToCoordinates(mapData.coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 300, left: 50 },
      animated: true,
    });

    const durationLeft = convertMinToHours(mapData.duration);
    const distanceLeft = mapData.distance;
    setMapDirectionResult(mapData);

    setLocationDetails((prevState) => ({
      ...prevState,
      travelDuration: durationLeft,
      distanceLeft,
    }));
    bottomSheetRef.current?.present();
    setIsLoading(false);
  };

  const onCenter = () => {
    if (mapDirectionResult) {
      mapRef.current.fitToCoordinates(mapDirectionResult.coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    } else {
      mapRef.current.animateToRegion(locationState.currentLocation);
    }
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        {isLoading && <AppLoader />}

        <TouchableOpacity
          style={style.showLocationContainer}
          onPress={onCenter}
        >
          <Image source={imagePath.liveLocationBtn} />
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          style={style.mapContainer}
          initialRegion={initialRegion}
          toolbarEnabled={true}
          loadingEnabled={false}
          showsUserLocation={true}
          mapType={"standard"}
          showsMyLocationButton={false}
        >
          {locationDetails.currentLocation && (
            <>
              {/* <Marker.Animated
                ref={markerRef}
                coordinate={locationDetails.currentLocation}
              >
                <CustomMarker
                  headerText={""}
                  text={null}
                  imgSrc={imagePath.truck}
                />
              </Marker.Animated> */}
              <Marker coordinate={locationDetails.dropLocation}>
                <CustomMarker
                  headerText={""}
                  text={null}
                  imgSrc={imagePath.dropMarker}
                />
              </Marker>
            </>
          )}

          {locationDetails.dropLocation && (
            <MapViewDirections
              origin={locationDetails.currentLocation}
              destination={locationDetails.dropLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor={theme.bgPrimary}
              optimizeWaypoints={true}
              onStart={(result) => {
                setIsLoading(true);
              }}
              onReady={(result) => {
                onMapReady(result);
              }}
            />
          )}
        </MapView>

        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          backgroundStyle={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#d6d6d6",
            elevation: 20,
          }}
          snapPoints={snapPoints}
        >
          <View>
            <CurrentTripDetails
              tripData={currentTrip}
              locationDetails={locationDetails}
            />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default LiveTracking;
