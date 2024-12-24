/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { AppProvider } from "./src/core/helper/AppContext";
import { ThemeProvider } from "./src/constants/ThemeContext";
import Navigation from "./src/navigation";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import notifee from "@notifee/react-native";

function App() {
  useEffect(() => {
    // Handle notifications in the foreground
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground notification received:", remoteMessage);
        if (remoteMessage) await onDisplayNotification();
        Alert.alert(
          "Notification",
          JSON.stringify(remoteMessage?.notification?.body)
        );
      }
    );

    // Request user permissions
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

    return unsubscribeForeground;
  }, []);
  return (
    <ThemeProvider>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </ThemeProvider>
  );
}

// Background handler (must be outside of any component)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background:", remoteMessage);
  await onDisplayNotification();
});

async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // Display a notification
  await notifee.displayNotification({
    title: "Notification Title",
    body: "Main body content of the notification",
    android: {
      channelId,
      smallIcon: "ic_launcher",
      pressAction: {
        id: "default",
      },
    },
  });
}

export default App;
