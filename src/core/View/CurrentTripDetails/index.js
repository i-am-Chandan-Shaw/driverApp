import React, { useState } from "react";
import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import style from "./style";
import commonStyles from "../../../constants/commonStyle";
import { useTheme } from "../../../constants/ThemeContext";
import { getInitials } from "../../helper/commonHelper";
import imagePath from "../../../constants/imagePath";
import { useNavigation } from "@react-navigation/native";
import { patch } from "../../helper/services";
import AppLoader from "../../component/AppLoader";
const CurrentTripDetails = ({ tripData, locationDetails, endCurrentTrip }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const customerSupportNumber = 8240687723;
  const [isLoading, setIsLoading] = useState(false);

  const callUser = () => {
    Linking.openURL(`tel:${tripData?.userPhone}`);
  };

  const callCustomerSupport = () => {
    Linking.openURL(`tel:${customerSupportNumber}`);
  };

  const startTrip = () => {
    if (tripData?.status == 4) {
      changeCurrentTripStatus(5);
    } else {
      if (locationDetails?.distanceLeft > 0.2) {
        Alert.alert(
          "Start Trip",
          "You haven't reached your destination yet. Are you sure you want to start the ride?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => {
                changeCurrentTripStatus(4);
              },
            },
          ]
        );
      }
    }
  };

  const confirmForCancellation = () => {
    Alert.alert("Cancel Ride", "Are you sure you want to cancel the ride?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Cancel",
        onPress: () => {
          changeCurrentTripStatus(7);
        },
      },
    ]);
  };

  const changeCurrentTripStatus = async (tripStatusValue) => {
    setIsLoading(true);
    const payload = {
      id: tripData?.tripId,
      status: tripStatusValue.toString(),
    };
    try {
      const data = await patch(payload, "patchRequestVehicle");

      if (!data) return;
      console.log("trip status updated");

      switch (tripStatusValue) {
        case 5:
          navigation.replace("Rating", { tripData });
          break;

        case 7:
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
          break;

        default:
          console.log(`Unhandled status value: ${tripStatusValue}`);
      }
    } catch (error) {
      console.error("Error changing trip status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDirectionInGoogleMap = () => {
    const startLat = locationDetails?.currentLocation.latitude;
    const startLng = locationDetails?.currentLocation.longitude;
    const endLat = locationDetails?.dropLocation.latitude;
    const endLng = locationDetails?.dropLocation.longitude;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}`;
    Linking.openURL(url);
  };

  return (
    <View>
      {isLoading && <AppLoader />}
      <View style={style.durationContainer}>
        <View style={[commonStyles.rowCenter, commonStyles.gap1]}>
          <Text style={commonStyles.fnt12Medium}>You will reach in</Text>
          <Text style={commonStyles.fnt12Medium}>
            {locationDetails?.travelDuration}
          </Text>
        </View>
        <Pressable onPress={showDirectionInGoogleMap}>
          <Text style={[commonStyles.fnt12Medium, { color: theme.success }]}>
            View in Google Map
          </Text>
        </Pressable>
      </View>

      <View style={style.topContainer}>
        <View style={style.userDetailsContainer}>
          <View style={style.imageContainer}>
            <Text style={commonStyles.fnt16Medium}>
              {getInitials(tripData?.userName)}
            </Text>
          </View>
          <View style={style.userMetaDataContainer}>
            <Text style={commonStyles.fnt16Medium} numberOfLines={1}>
              {tripData?.userName}
            </Text>
            <View style={[commonStyles.rowCenter, commonStyles.gap1]}>
              <MatIcon name="location-pin" size={12} color="#777" />
              <Text style={commonStyles.fnt10Regular}>
                {tripData?.distance} Km ({tripData?.goodsType})
              </Text>
            </View>
            <View style={[commonStyles.rowCenter, commonStyles.gap1]}>
              <MatIcon name="star" size={12} color="#FBC02D" />
              <Text style={commonStyles.fnt10Regular}>4.8 (212 reviews)</Text>
            </View>
          </View>
        </View>
        <Image style={style.vehicleImage} source={imagePath.tataAce} />
      </View>
      <View style={style.paymentContainer}>
        <Text
          style={[commonStyles.fnt14Medium, { color: theme.textTertiary }]}
          numberOfLines={1}
        >
          Amount to be collected
        </Text>
        <Text style={commonStyles.fnt24Medium} numberOfLines={1}>
          ₹ {tripData?.amount}
        </Text>
      </View>
      <View style={style.actionContainer}>
        <View style={[commonStyles.rowCenter, commonStyles.gap2]}>
          <Pressable onPress={callUser} style={style.circularContainer}>
            <FeatherIcon name="phone" color={theme.bgPrimary} size={20} />
          </Pressable>
          <Pressable
            onPress={callCustomerSupport}
            style={style.circularContainer}
          >
            <MatIcon name="support-agent" size={30} color="#FBC02D" />
          </Pressable>
        </View>
        <TouchableOpacity
          onPress={startTrip}
          style={[
            tripData?.status == 2
              ? commonStyles.btnPrimary
              : commonStyles.btnSuccess,
            style.tripStatusBtn,
          ]}
        >
          <Text
            style={[
              commonStyles.fnt16Medium,
              commonStyles.textCenter,
              commonStyles.textWhite,
            ]}
          >
            {tripData?.status == 2 ? "Start Trip" : "Complete Trip"}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={style.addressContainer}>
          <Text style={commonStyles.fnt16Medium} numberOfLines={1}>
            Trip Details
          </Text>
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
                {tripData?.pickUpLocation}
              </Text>
              <View style={{ height: 30 }}></View>
              <Text numberOfLines={2} style={[style.text]}>
                {tripData?.dropLocation}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={confirmForCancellation}
            style={[commonStyles.btnDanger, { marginTop: 24 }]}
          >
            <Text
              style={[
                commonStyles.fnt16Medium,
                commonStyles.textCenter,
                commonStyles.textWhite,
              ]}
            >
              Cancel Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CurrentTripDetails;
