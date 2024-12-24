import { patch } from "./services";

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
