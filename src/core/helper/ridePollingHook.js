import { useEffect, useRef } from "react";
import { AppState } from "react-native";

const useRidePolling = (
  isOnDuty,
  availableTrips,
  getActiveRides,
  delayFetchRef
) => {
  const appStateRef = useRef(AppState.currentState);
  const intervalIdRef = useRef(null);

  const pollRides = async () => {
    if (availableTrips.length === 0 && !delayFetchRef.current) {
      await getActiveRides();
    } else if (availableTrips.length > 0) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const startPolling = () => {
    pollRides();
    intervalIdRef.current = setInterval(() => pollRides(), 5000);
  };

  const stopPolling = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  useEffect(() => {
    // Handle app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
        console.log(appStateRef);
        
      if (
        appStateRef.current === "background" &&
        nextAppState === "active" &&
        isOnDuty
      ) {
        // App has come to foreground - fetch immediately and restart polling
        pollRides();
        startPolling();
      } else if (
        appStateRef.current === "active" &&
        nextAppState === "background"
      ) {
        // App has gone to background - stop polling
        // stopPolling();
      }

      appStateRef.current = nextAppState;
    });

    // Start/stop polling based on isOnDuty status
    if (isOnDuty) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      subscription.remove();
      stopPolling();
    };
  }, [isOnDuty, availableTrips, getActiveRides]);
};

export default useRidePolling;
