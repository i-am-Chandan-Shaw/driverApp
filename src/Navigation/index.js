import React from "react";
import { NavigationContainer, Alert } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screen/Home";
import ChooseLocation from "../screen/ChooseLocation";
import SplashScreen from "../screen/SplashScreen";
import BookingScreen from "../screen/BookingScreen";
import Login from "../screen/Login";
import TripDetails from "../screen/TripDetails";
import RideHistory from "../screen/RideHistory";
import Wallet from "../screen/Wallet";
import EarningHistory from "../screen/EarningHistory";
import VerificationPage from "../screen/Verification";
import Register from "../screen/Register";
import BankDetails from "../screen/BankDetails";
import LiveTracking from "../screen/LiveTracking";
import RatingScreen from "../screen/RatingScreen";
import TermsAndConditions from "../screen/TermsAndConditions";
import { useTheme } from "../constants/ThemeContext";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { theme } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.bgLight,
          },
          headerTintColor: theme.bgDark,
        }}
      >
        <Stack.Screen name="Intro" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="LiveTracking" component={LiveTracking} />
        <Stack.Screen
          name="BankDetails"
          options={{ headerShown: true, title: "Bank Details" }}
          component={BankDetails}
        />
        <Stack.Screen
          name="TermsAndConditions"
          options={{ headerShown: true, title: "Terms & Conditions" }}
          component={TermsAndConditions}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
        <Stack.Screen
          name="Verification"
          options={{ headerShown: true, title: "Verification" }}
          component={VerificationPage}
        />
        <Stack.Screen
          name="EarningHistory"
          options={{ headerShown: true, title: "Earning History" }}
          component={EarningHistory}
        />
        <Stack.Screen
          name="RideHistory"
          options={{ headerShown: true, title: "Orders" }}
          component={RideHistory}
        />
        <Stack.Screen
          name="Wallet"
          options={{ headerShown: true, title: "Wallet" }}
          component={Wallet}
        />
        <Stack.Screen
          name="TripDetails"
          options={{ headerShown: true, title: "Trip Details" }}
          component={TripDetails}
        />
        <Stack.Screen
          name="Rating"
          component={RatingScreen}
          options={{
            headerShown: true,
            title: "Rating & Review",
            headerLeft: () => {
              return null;
            },
            title: "Rating & Review",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
