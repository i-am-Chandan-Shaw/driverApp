import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AppTextInput from "../../core/component/AppTextInput";
import { Snackbar, Provider } from "react-native-paper";
import { get, patch } from "../../core/helper/services";
import { AppContext } from "../../core/helper/AppContext";
import commonStyles from "../../constants/commonStyle";
import { useTheme } from "../../constants/ThemeContext";
import useFontStyles from "../../constants/fontStyle";
import { DriverEnum } from "../../constants/enums";
import AppLoader from "../../core/component/AppLoader";

const BankDetails = () => {
  const { theme } = useTheme();
  const fontStyles = useFontStyles();
  const { globalData, setGlobalData } = useContext(AppContext);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Please fill all the data"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    id: globalData?.driverId,
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    branchName: "",
    swiftCode: "",
    bankLocation: "",
    accountType: "Savings",
  });

  // Fetch Driver Details on component mount
  useEffect(() => {
    const driverData = globalData.driverData;
    if (globalData.driverData) {
      setBankDetails({
        id: driverData.id,
        accountHolderName: driverData.accountHolderName || "",
        bankName: driverData.bankName || "",
        accountNumber: driverData.accountNumber || "",
        branchName: driverData.branchName || "",
        swiftCode: driverData.swiftCode || "",
        bankLocation: driverData.bankLocation || "",
        accountType: "Savings",
      });
    }
  }, [globalData]);

  useEffect(() => {
    validateForm();
  }, [bankDetails]);
  // Function to fetch driver details from the API
  const fetchDriverDetails = async (driverId) => {
    setIsLoading(true);
    try {
      const queryParameter = `?driverId=${driverId}`;
      const data = await get("getDriver", queryParameter);
      if (data) {
        setGlobalData(DriverEnum.DRIVER_DATA, data[0]);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBankDetails = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      await patch(bankDetails, "patchDriver");
      fetchDriverDetails(bankDetails.id);
      setSnackbarMessage("Bank Details Updated");
      setIsSnackbarVisible(true);
      setIsFormValid(false);
    } catch (error) {
      console.error("Error updating bank details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input change and validate fields
  const handleInputChange = (value, field) => {
    const nameRegex = /^[a-zA-Z\s]*$/;

    // Handle specific fields like accountNumber and swiftCode
    if (["accountNumber", "swiftCode"].includes(field)) {
      setBankDetails((prev) => ({
        ...prev,
        [field]:
          field === "accountNumber" ? value.replace(/[^0-9]/g, "") : value,
      }));
    } else if (nameRegex.test(value) || field !== "accountHolderName") {
      setBankDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    // Ensure that all values are defined and then check if they are non-empty
    const isValid = Object.values(bankDetails).every(
      (field) => (field || "").trim() !== ""
    );

    setIsFormValid(isValid);
  };

  const dismissSnackbar = () => setIsSnackbarVisible(false);

  return (
    <>
      {isLoading && <AppLoader />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View
            style={[
              commonStyles.flex1,
              commonStyles.p16,
              { backgroundColor: theme.bgLight },
            ]}
          >
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
              <View style={{ gap: 20 }}>
                <Text style={{ color: theme.textPrimary }}>
                  Account Information:
                </Text>
                <AppTextInput
                  onChangeText={(text) =>
                    handleInputChange(text, "accountHolderName")
                  }
                  value={bankDetails.accountHolderName}
                  height={30}
                  placeholder="Account Holder Name"
                  placeholderTextColor={theme.textTertiary}
                />
                <AppTextInput
                  onChangeText={(text) =>
                    handleInputChange(text, "accountNumber")
                  }
                  value={bankDetails.accountNumber}
                  height={30}
                  keyboardType="decimal-pad"
                  placeholder="Account Number"
                  placeholderTextColor={theme.textTertiary}
                />

                <Text style={{ color: theme.textPrimary }}>
                  Bank Information:
                </Text>
                <AppTextInput
                  onChangeText={(text) => handleInputChange(text, "bankName")}
                  value={bankDetails.bankName}
                  height={30}
                  placeholder="Bank Name"
                  placeholderTextColor={theme.textTertiary}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <AppTextInput
                    onChangeText={(text) =>
                      handleInputChange(text, "swiftCode")
                    }
                    value={bankDetails.swiftCode}
                    height={30}
                    placeholder="IFSC Code"
                    style={{ flex: 1, textTransform: "uppercase" }}
                    placeholderTextColor={theme.textTertiary}
                  />
                  <AppTextInput
                    onChangeText={(text) =>
                      handleInputChange(text, "bankLocation")
                    }
                    value={bankDetails.bankLocation}
                    height={30}
                    style={{ flex: 1 }}
                    placeholder="City"
                    placeholderTextColor={theme.textTertiary}
                  />
                </View>

                <AppTextInput
                  onChangeText={(text) => handleInputChange(text, "branchName")}
                  value={bankDetails.branchName}
                  height={30}
                  placeholder="Branch Name"
                  placeholderTextColor={theme.textTertiary}
                />

                <Text
                  style={[
                    commonStyles.fnt12Regular,
                    commonStyles.mb16,
                    { color: theme.bgDark },
                  ]}
                >
                  *By adding this bank account, I agree to T&Cs regarding
                  topping up from bank account.
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              disabled={!isFormValid}
              style={[
                isFormValid
                  ? commonStyles.btnPrimary
                  : commonStyles.btnDisabled,
              ]}
              onPress={updateBankDetails}
            >
              <Text style={[{ color: theme.white }, commonStyles.fnt16Medium]}>
                {bankDetails.accountNumber.length === 0
                  ? "Add Bank Account"
                  : "Update Bank Account"}
              </Text>
            </TouchableOpacity>
          </View>
          <Snackbar
            style={{ backgroundColor: theme.bgSecondary }}
            visible={isSnackbarVisible}
            duration={4000}
            onDismiss={dismissSnackbar}
            action={{
              label: "OK",
              labelStyle: { color: "#fff" },
              onPress: () => {},
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default BankDetails;
