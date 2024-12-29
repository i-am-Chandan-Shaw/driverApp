import DeviceInfo from "react-native-device-info";
import { patch } from "./services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const updateDriverPushToken = async (driverId, pushToken) => {
  const payload = {
    id: driverId,
    pushToken,
  };

  try {
    const response = await patch(payload, "patchDriver");
    return response;
  } catch (fetchError) {
    console.error("Error patching access token:", fetchError);
    return null;
  }
};

export const checkAppVersion = async () => {
  const CURRENT_VERSION = DeviceInfo.getVersion();

  try {
    const storedVersion = await AsyncStorage.getItem("app_version");

    if (!storedVersion) {
      await AsyncStorage.setItem("app_version", CURRENT_VERSION);
      console.log("Stored current version as it was not found previously.");
      return;
    }

    if (storedVersion !== CURRENT_VERSION) {
      await AsyncStorage.setItem("app_version", CURRENT_VERSION);
      await clearCache();
    }
  } catch (error) {
    console.error("Failed to check app version:", error);
  }
};

const clearCache = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Cache cleared successfully.");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
};
