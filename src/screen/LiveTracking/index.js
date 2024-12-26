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
  const navigation = useNavigation();

  const mapRef = useRef();
  const markerRef = useRef();
  const bottomSheetRef = useRef();
  const { globalData } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState(null);
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

  const initializeMapDirectionPoints = (tripData) => {
    if (!tripData) {
      return null;
    }

    console.log(tripData);

    const tripStarted = tripData.status == 4;

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
        await updateDriverCurrentLocation(coordinates);
      }
      setLocationDetails((prevState) => ({
        ...prevState,
        currentLocation: coordinates,
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }, [globalData.driverData, currentTrip]); // Include dependencies.

  const updateDriverCurrentLocation = async (coordinates) => {
    if (!currentTrip) {
      return null;
    }
    const payload = {
      id: globalData.driverData?.id,
      lat: coordinates.latitude.toString(),
      lng: coordinates.longitude.toString(),
    };

    const endPoint = "patchDriver";
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
          console.log(trip[0].status);

          initializeMapDirectionPoints(trip[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching trip status:", error);
    }
  }, [currentTrip?.tripId, navigation]);

  // -------------------------- Initialization Logic ------------------------------ //

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if trip data exists in route params and initialize the trip.
        const tripData = props?.route?.params?.tripData;
        if (tripData && !currentTrip) {
          setCurrentTrip(tripData);
          initializeMapDirectionPoints(tripData); // Initialize map points for the trip data.
        } else if (!currentTrip) {
          await fetchTripData(); // Fetch trip data if not already initialized.
        }
      } catch (error) {
        console.error("Error during initial load:", error);
      }
    };

    initialize();

    // Set up interval for periodic API calls.
    const intervalId = setInterval(() => {
      fetchCurrentLocationAndUpdate();
      getTripStatus();
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount.
  }, [
    props?.route.params.tripData,
    currentTrip,
    fetchCurrentLocationAndUpdate,
    getTripStatus,
  ]);

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
