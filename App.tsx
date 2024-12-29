import React, { useEffect } from "react";
import { AppProvider } from "./src/core/helper/AppContext";
import { ThemeProvider } from "./src/constants/ThemeContext";
import Navigation from "./src/navigation";
import messaging from "@react-native-firebase/messaging";

function App() {
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log("User granted messaging permissions");
      } else {
        console.warn("Messaging permissions not granted");
      }
    };

    requestPermission();
  }, []);
  return (
    <ThemeProvider>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </ThemeProvider>
  );
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background:", remoteMessage);
});

export default App;
