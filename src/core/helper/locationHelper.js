import {
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { REACT_APP_MAPS_API } from "@env";

const GOOGLE_MAPS_API_KEY = REACT_APP_MAPS_API;
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === "ios") {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          "whenInUse"
        );
        if (permissionStatus === "granted") {
          return resolve("granted");
        }
        reject("permission not granted");
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Load Go ",
        message: "Load Go wants  to access your location ",
      }
    )
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve("granted");
        }
        return reject("Location Permission Denied");
      })
      .catch((error) => {
        console.log("Ask Location Permission Error", error);
        return reject(error);
      });
  });

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve(cords);
      },
      (error) => {
        reject("getCurrentLocation error", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

export const getAddressFromCoordinates = (latitude, longitude) =>
  new Promise((resolve, reject) => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        latitude +
        "," +
        longitude +
        "&key=" +
        GOOGLE_MAPS_API_KEY
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "OK") {
          resolve(responseJson?.results?.[0]?.formatted_address);
        } else {
          reject("not found");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const handleLocationPermission = async (shouldOpenSettings) => {
  const permissionStatus = await locationPermission(); // Imported or defined elsewhere
  if (permissionStatus !== "granted") {
    if (shouldOpenSettings) Linking.openSettings();
    return false;
  }
  return true;
};

export const fetchAndPrepareLocationData = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    if (!latitude || !longitude) throw new Error("Invalid coordinates");

    const currentAddress = await getAddressFromCoordinates(latitude, longitude);

    return {
      coordinates: {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      address: currentAddress,
    };
  } catch (error) {
    console.error("Error in fetching location data:", error);
    return null;
  }
};

export const getInitialRegionForMap = () => {
  return {
    latitude: 22.5629,
    longitude: 88.3962,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
};
