import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import style from "./style";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../helper/AppContext";
import { get, patch } from "../../helper/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../constants/ThemeContext";
import commonStyles from "../../../constants/commonStyle";
import AppLoader from "../AppLoader";
import { DriverEnum } from "../../../constants/enums";
import { convertMinToHours } from "../../helper/commonHelper";

const TripCard = ({ cardData, sendData }) => {
  const { theme } = useTheme();
  const { globalData, setGlobalData } = useContext(AppContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const currentTripData = cardData[0];

  const getUpdatedTripDetails = async (tripId) => {
    const query = `?tripId=${tripId}`;
    try {
      const data = await get("getRequestVehicle", query);
      return data ? data[0] : null;
    } catch (error) {
      console.error("Error fetching trip details:", error);
      setIsLoading(false);
      return null;
    }
  };

  const handleAcceptRide = async (trip) => {
    setIsLoading(true);
    try {
      const updatedTrip = await getUpdatedTripDetails(trip.tripId);
      if (!updatedTrip) return;

      switch (parseInt(updatedTrip.status)) {
        case 1:
          await acceptTrip(updatedTrip);
          break;
        case 2:
          sendData("invalid");
          break;
        default:
          sendData("others");
          break;
      }
    } catch (error) {
      console.error("Error handling accept ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptTrip = async (trip) => {
    if (!trip?.tripId || !globalData?.driverData?.id) {
      console.error("Invalid trip or driver data.");
      return;
    }

    const payload = {
      id: trip.tripId,
      status: 2,
      driverId: globalData.driverData.id,
    };

    try {
      const response = await patch(payload, "patchRequestVehicle");
      if (response) {
        getTripStatus(trip);
      } else {
        console.warn("Failed to accept the trip. No response from server.");
      }
    } catch (error) {
      console.error("Error accepting trip:", error.message || error);
    }
  };

  const getTripStatus = async (trip) => {
    const queryParameter = `?tripId=${trip.tripId}`;
    try {
      const trip = await get("getRequestVehicle", queryParameter);
      if (trip[0]) {
        navigation.replace("LiveTracking", {
          tripData: trip[0],
        });
      }
    } catch (error) {
      console.error("Error fetching trip status:", error);
    }
  };

  const handleDeclineRide = () => {
    sendData();
  };

  return (
    <View>
      {isLoading && <AppLoader />}
      {currentTripData && (
        <View style={style.cards}>
          <View style={style.headerContainer}>
            <View style={commonStyles}>
              <View style={[commonStyles.rowCenter, commonStyles.gap1]}>
                <Text style={[commonStyles.fnt16Medium]}>
                  {currentTripData?.userName}
                </Text>
                {currentTripData.usersRating >= 3 && (
                  <>
                    <MatIcon name="star" size={12} color={theme.bgPrimary} />
                    <Text style={[commonStyles.fnt12Regular]}>
                      {currentTripData?.usersRating}
                    </Text>
                  </>
                )}
              </View>
              <View style={style.infoContainer}>
                <MatIcon name="location-pin" size={12} color="#333" />
                <Text style={[commonStyles.fnt12Regular]}>
                  {currentTripData?.distance} Km (
                  {convertMinToHours(currentTripData?.totalTime)})
                </Text>
              </View>
              <View style={style.infoContainer}>
                <Text style={[commonStyles.fnt12Regular, { color: "#333" }]}>
                  Goods Type: {currentTripData?.goodsType}
                </Text>
              </View>
            </View>
            <View style={style.rightContainer}>
              <Text style={style.subHeaderText}>
                ₹ {currentTripData?.amount}
              </Text>
            </View>
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
                <Text numberOfLines={2} style={[style.text]}>
                  {currentTripData?.pickUpLocation}
                </Text>
                <View style={{ height: 30 }}></View>
                <Text numberOfLines={2} style={[style.text]}>
                  {currentTripData?.dropLocation}
                </Text>
              </View>
            </View>
          </View>
          <View style={style.bottomContainer}>
            <TouchableOpacity
              onPress={() => {
                handleDeclineRide(currentTripData);
              }}
              style={[style.button, {}]}
            >
              <Text style={style.btnText}>Decline</Text>
            </TouchableOpacity>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              onPress={() => {
                handleAcceptRide(cardData[0]);
              }}
              style={[style.button, { backgroundColor: theme.bgPrimary }]}
            >
              <Text style={[commonStyles.fnt16Medium, { color: theme.white }]}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default TripCard;
