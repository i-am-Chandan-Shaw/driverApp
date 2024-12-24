import React, { useContext, useEffect } from "react";
import { View, Image } from "react-native";
import { handleLocationPermission } from "../../core/helper/locationHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonStyles from "../../constants/commonStyle";
import { DriverEnum } from "../../constants/enums";
import { get } from "../../core/helper/services";
import { AppContext } from "../../core/helper/AppContext";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const { setGlobalData } = useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await initializeApp();
    });

    return () => clearTimeout(timeout); // Cleanup timeout
  }, []);

  const initializeApp = async () => {
    try {
      await Promise.all([
        checkDriverAuthentication(),
        handleLocationPermission(),
      ]);
    } catch (error) {
      console.error("Error during app initialization:", error);
    }
  };

  const checkDriverAuthentication = async () => {
    try {
      const driverId = await AsyncStorage.getItem(DriverEnum.DRIVER_ID);
      if (driverId) {
        await initializeGLobalData(driverId);
      } else {
        console.warn("Driver ID not found, redirecting to login.");
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Error retrieving driver ID from storage:", error);
      navigation.replace("Login");
    }
  };

  const initializeGLobalData = async (driverId) => {
    if (!driverId) {
      console.error("Invalid driver ID");
      return;
    }

    try {
      const queryParameter = `?driverId=${driverId}`;
      const driverData = await get("getDriver", queryParameter);

      if (driverData) {
        
        
        setGlobalData(DriverEnum.DRIVER_DATA, driverData[0]);
        console.log("Driver data saved in global context!");
        navigation.replace("Home");
      } else {
        console.warn("No driver data returned from API, redirecting to login.");
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Error fetching driver data from API:", error);
      navigation.replace("Login");
    }
  };

  return (
    <View style={[commonStyles.flexCenter]}>
      <Image
        style={{ width: "40%", height: undefined, aspectRatio: 470 / 347 }}
        source={require("../../assets/images/logo.png")}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
