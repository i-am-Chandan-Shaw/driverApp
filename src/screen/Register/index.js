import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import style from "./style";
import AppTextInput from "../../core/component/AppTextInput";
import { Picker } from "@react-native-picker/picker";
import { Snackbar, Checkbox, Appbar } from "react-native-paper";
import { post, get } from "../../core/helper/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../core/helper/AppContext";
import AppLoader from "../../core/component/AppLoader";
import Colors from "../../constants/Colors";
import commonStyles from "../../constants/commonStyle";
import { useTheme } from "../../constants/ThemeContext";
import { DriverEnum } from "../../constants/enums";
import { useNavigation } from "@react-navigation/native";

const Register = ({ route }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedVehicle, setSelectedVehicle] = useState("tataAce");
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("Please fill all the data");
  const [isLoading, setIsLoading] = useState(false);
  const { setGlobalData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    driverName: "",
    email: "",
    vehicleType: selectedVehicle,
    vehicleNo: "",
    phone: route.params?.phone || "974771340",
  });

  const validateInputs = useCallback((inputValue, inputType) => {
    const namePattern = /^[a-zA-Z\s]*$/;
    if (inputType === "driverName" && !namePattern.test(inputValue)) return;

    setFormData((prevData) => ({
      ...prevData,
      [inputType]: inputValue,
    }));
  }, []);

  const isDataValid = useCallback(() => {
    return !Object.values(formData).some((value) => value.trim() === "");
  }, [formData]);

  const validateForm = () => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!isDataValid()) {
      setSnackBarText("Please fill all the data");
      setVisible(true);
    } else if (!emailPattern.test(formData.email)) {
      setSnackBarText("Invalid Email");
      setVisible(true);
    } else {
      registerUser();
    }
  };

  const registerUser = async () => {
    setIsLoading(true);
    try {
      console.log(formData);

      const response = await post(formData, "registerDriver");
      if (response) {
        console.log(response);

        await saveToLocalStorage(response.id);
      }
    } catch (error) {
      emailExistsAlert();
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = async (id) => {
    if (!id) {
      console.error("Invalid driver ID");
      return false;
    }
    const queryParameter = `?driverId=${id}`;
    try {
      await AsyncStorage.setItem(DriverEnum.DRIVER_ID, id.toString());
      const data = await get("getDriver", queryParameter);

      if (data) {
        setGlobalData(DriverEnum.DRIVER_DATA, data[0]);
        showAlert();
        console.log("Driver data saved in global context!");
        return true;
      } else {
        console.warn("No driver data returned from API");
        return false;
      }
    } catch (error) {
      console.error("Error handling driver data:", error);
      return false;
    }
  };

  const showAlert = (driverData) => {
    Alert.alert(
      "Registration Successful",
      "You have successfully registered yourself. Please press OK to continue.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.replace("Home", { driverData });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const emailExistsAlert = () => {
    Alert.alert(
      "Email already exists",
      "The entered email already exists, please try other email address !",
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false }
    );
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleBackPress = () => {
    navigation.replace("Login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: theme.bgLight }}>
          <Appbar.BackAction
            size={20}
            color={theme.bgDark}
            onPress={handleBackPress}
          />
          <Appbar.Content
            title="Back"
            titleStyle={[
              commonStyles.fnt16Medium,
              { color: theme.textPrimary },
            ]}
          />
        </Appbar.Header>
        <View
          style={[
            commonStyles.flex1,
            commonStyles.p16,
            { backgroundColor: theme.bgLight },
          ]}
        >
          <ScrollView automaticallyAdjustKeyboardInsets={true}>
            <View>
              {isLoading && <AppLoader />}
              <View>
                <Text
                  style={[
                    commonStyles.fnt24Medium,
                    commonStyles.textPrimary,
                    commonStyles.mb24,
                    { color: theme.bgDark },
                  ]}
                >
                  Sign up
                </Text>
                <View style={{ gap: 20 }}>
                  <AppTextInput
                    onChangeText={(text) => validateInputs(text, "driverName")}
                    value={formData.driverName}
                    height={50}
                    placeholder="Full Name"
                  />
                  <AppTextInput
                    onChangeText={(text) => validateInputs(text, "email")}
                    value={formData.email}
                    inputMode="email"
                    height={50}
                    placeholder="Email"
                  />
                  <View
                    style={[style.selectBox, { backgroundColor: theme.bgInfo }]}
                  >
                    <Picker
                      enabled={false}
                      selectedValue={selectedVehicle}
                      style={{ color: theme.bgDark }}
                      dropdownIconColor={theme.bgDark}
                      onValueChange={(itemValue) =>
                        setSelectedVehicle(itemValue)
                      }
                    >
                      <Picker.Item label="Tata Ace" value="tataAce" />
                    </Picker>
                  </View>
                  <AppTextInput
                    onChangeText={(text) => validateInputs(text, "vehicleNo")}
                    value={formData.vehicleNo}
                    height={50}
                    maxLength={10}
                    minLength={8}
                    style={{ textTransform: "uppercase" }}
                    placeholder="Vehicle Number"
                  />
                  <View style={[commonStyles.rowFlex, commonStyles.alignTop]}>
                    <Checkbox
                      status={checked ? "checked" : "unchecked"}
                      color={Colors.bgPrimary}
                      uncheckedColor={theme.bgDark}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text
                      style={[
                        commonStyles.fnt12Regular,
                        commonStyles.flex1,
                        commonStyles.mt5,
                        { color: theme.bgDark },
                      ]}
                    >
                      By signing up. you agree to the Terms of service and
                      Privacy policy.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            disabled={!checked}
            style={checked ? commonStyles.btnPrimary : commonStyles.btnDisabled}
            onPress={validateForm}
          >
            <Text
              style={[
                commonStyles.fnt16Medium,
                commonStyles.textCenter,
                commonStyles.textWhite,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <Snackbar
          style={style.snackBar}
          visible={visible}
          duration={4000}
          onDismiss={onDismissSnackBar}
          action={{
            label: "OK",
            labelStyle: { color: "#fff" },
            onPress: () => {
              // Do something
            },
          }}
        >
          {snackBarText}
        </Snackbar>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;
