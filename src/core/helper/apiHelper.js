import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "./services";

export const getCurrentTripData = async (tripId) => {
  const queryParameter = `?tripId=${tripId}`;
  try {
    const tripData = await get("getRequestVehicle", queryParameter);
    return tripData;
  } catch (fetchError) {
    console.error("Error fetching current trip details:", fetchError);
    return null;
  }
};
