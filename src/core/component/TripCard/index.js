import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import style from "./style";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../helper/AppContext";
import { get, patch } from "../../helper/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../constants/ThemeContext";
import commonStyles from "../../../constants/commonStyle";

const TripCard = ({ cardData, sendData, userData }) => {
  const { theme } = useTheme();
  const [renderedData, setRenderedData] = useState([cardData[0]]);
  const { globalData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    console.log("===>", cardData);
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

  const declineRide = (item) => {
    const updatedData = [...renderedData];
    let index = updatedData.indexOf(item);
    updatedData.splice(index, 1);
    setRenderedData(updatedData);
    if (updatedData.length == 0) {
      sendData(updatedData, "declined");
    }
  };

  const acceptRide = async (trip) => {
    storeTripId(trip.tripId);
    setIsLoading(true);
    try {
      trip = await getUpdatedTripDetails(trip.tripId);
      console.log(trip);
      if (trip.status == 1) {
        const payload = {
          id: trip.tripId,
          status: 2,
          driverId: globalData.driverId,
        };
        try {
          const data = await patch(payload, "patchRequestVehicle");
          if (data) {
            trackLive(trip);
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      } else if (trip.status == 2) {
        const updatedData = [];
        setIsLoading(false);
        sendData(updatedData, "invalid");
      } else {
        const updatedData = [];
        setIsLoading(false);
        sendData(updatedData, "others");
      }
    } catch (error) {
      console.log("acceptRide error===>", error);
      setIsLoading(false);
    }
  };

  const getUpdatedTripDetails = async (id) => {
    const queryParameter = "?tripId=" + id.toString();
    try {
      const data = await get("getRequestVehicle", queryParameter);
      if (data) {
        return data[0];
      }
    } catch (error) {
      console.log("getTripStatus", error);
      setIsLoading(false);
    }
  };

  const trackLive = (trip) => {
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

      navigation.navigate("LiveTracking", {
        coordinates: data,
        tripData: trip,
      });
    }
  };

  const storeTripId = async (id) => {
    try {
      await AsyncStorage.setItem("tripId", id.toString());
      let driver = await AsyncStorage.getItem("driverId");
      if (driver) {
        console.log(driver);
      }
      console.log("Data saved successfully!");
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={style.cards}>
        {/* <ProgressBar style={{borderRadius:10}} progress={0.5} color={'blue'} /> */}
        <View style={style.headerContainer}>
          <Avatar.Icon color="#ddd" size={28} icon="account" />
          <Text style={[style.headerText, { marginLeft: 10 }]}>
            {item?.userName}(4.3)
          </Text>
        </View>
        <View style={style.topContainer}>
          <View style={style.locationContainer}>
            <View style={style.timeLine}>
              <View style={style.circle}></View>
              <View style={style.dottedLine}></View>
              <View
                style={[style.circle, { backgroundColor: "#568203" }]}
              ></View>
            </View>
            <View style={style.locationText}>
              <Text numberOfLines={1} style={[style.text]}>
                {item?.pickUpLocation}
              </Text>
              <View style={{ height: 26 }}></View>
              <Text numberOfLines={1} style={[style.text]}>
                {item?.dropLocation}
              </Text>
            </View>
          </View>
          <View style={style.rightContainer}>
            <Text style={style.subHeaderText}>₹ {item?.amount}</Text>
            {/* <Text style={[style.mediumText, { marginTop: 3 }]}> 333 m</Text> */}
            {/* <Text style={style.mediumText}>5 min</Text> */}
          </View>
        </View>
        <View style={style.bottomContainer}>
          <TouchableOpacity
            onPress={() => {
              declineRide(item);
            }}
            style={[style.button, {}]}
          >
            <Text style={style.btnText}>Decline</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity
            onPress={() => {
              acceptRide(cardData[index]);
            }}
            style={[style.button, { backgroundColor: theme.bgPrimary }]}
          >
            <Text style={[commonStyles.fnt16Medium, { color: theme.white }]}>
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      {isLoading && (
        <View style={style.indicatorContainer}>
          <ActivityIndicator size={35} animating={true} color={"#fff"} />
        </View>
      )}
      {renderedData.length > 0 && (
        <FlatList
          data={renderedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.tripId}
        />
      )}
    </View>
  );
};

export default TripCard;
