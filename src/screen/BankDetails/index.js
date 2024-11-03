import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import AppTextInput from '../../core/component/AppTextInput';
import { Snackbar, Provider } from 'react-native-paper';
import { get, patch } from '../../core/helper/services';
import { AppContext } from '../../core/helper/AppContext';
import AppLoader from '../../core/component/AppLoader';
import commonStyles from '../../constants/commonStyle';
import { useTheme } from '../../constants/ThemeContext';
import useFontStyles from "../../constants/fontStyle";

const BankDetails = () => {
    const { theme } = useTheme();
    const fontStyles = useFontStyles();
    const { globalData } = useContext(AppContext);

    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('Please fill all the data');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        id: globalData?.driverId,
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        branchName: '',
        swiftCode: '',
        bankLocation: '',
        accountType: 'Savings'
    });

    useEffect(() => {
        fetchDriverDetails(globalData?.driverId);
        validateForm();
    }, []);

    useEffect(() => {
        validateForm();
    }, [bankDetails]);

    const fetchDriverDetails = async (driverId) => {
        setIsLoading(true);
        try {
            const queryParameter = `?driverId=${driverId}`;
            const data = await get('getDriver', queryParameter);
            if (data?.length) {
                const { accountHolderName = '', bankName = '', accountNumber = '', branchName = '', swiftCode = '', bankLocation = '' } = data[0];

                setBankDetails({
                    id: driverId,
                    accountHolderName,
                    bankName,
                    accountNumber: accountNumber === 0 ? '' : accountNumber,
                    branchName,
                    swiftCode,
                    bankLocation,
                    accountType: 'Savings'
                });
            }

        } catch (error) {
            // Handle error if needed
        } finally {
            setIsLoading(false);
        }
    };

    const updateBankDetails = async () => {
        setIsLoading(true);
        Keyboard.dismiss();
        try {
            await patch(bankDetails, 'patchDriver');
            setSnackbarMessage('Bank Details Updated');
            setIsSnackbarVisible(true);
            setIsFormValid(false);
        } catch (error) {
            // Handle error if needed
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (value, field) => {
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (['accountNumber', 'swiftCode'].includes(field)) {
            setBankDetails((prev) => ({
                ...prev,
                [field]: field === 'accountNumber' ? value.replace(/[^0-9]/g, '') : value
            }));
        } else if (nameRegex.test(value)) {
            setBankDetails((prev) => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const validateForm = () => {
        const isValid = Object.values(bankDetails).every((field) => field !== '');
        setIsFormValid(isValid);
    };


    const dismissSnackbar = () => setIsSnackbarVisible(false);

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={[commonStyles.mainContainer, commonStyles.p16, { backgroundColor: theme.bgLight }]}>
            <Provider >
                {isLoading && <AppLoader />}
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ gap: 20, }}>
                        <Text style={{ color: theme.textPrimary }}>Account Information:</Text>
                        <AppTextInput
                            onChangeText={(text) => handleInputChange(text, 'accountHolderName')}
                            value={bankDetails.accountHolderName}
                            height={30}
                            placeholder="Account Holder Name"
                            placeholderTextColor={theme.textTertiary}
                        />
                        <AppTextInput
                            onChangeText={(text) => handleInputChange(text, 'accountNumber')}
                            value={bankDetails.accountNumber}
                            height={30}
                            keyboardType="decimal-pad"
                            placeholder="Account Number"
                            placeholderTextColor={theme.textTertiary}
                        />

                        <Text style={{ color: theme.textPrimary }}>Bank Information:</Text>
                        <AppTextInput
                            onChangeText={(text) => handleInputChange(text, 'bankName')}
                            value={bankDetails.bankName}
                            height={30}
                            placeholder="Bank Name"
                            placeholderTextColor={theme.textTertiary}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                            <AppTextInput
                                onChangeText={(text) => handleInputChange(text, 'swiftCode')}
                                value={bankDetails.swiftCode}
                                height={30}
                                style={{ flex: 1, textTransform: 'uppercase' }}
                                placeholderTextColor={theme.textTertiary}
                            />
                            <AppTextInput
                                onChangeText={(text) => handleInputChange(text, 'bankLocation')}
                                value={bankDetails.bankLocation}
                                height={30}
                                style={{ flex: 1 }}
                                placeholder="City"
                                placeholderTextColor={theme.textTertiary}
                            />
                        </View>

                        <AppTextInput
                            onChangeText={(text) => handleInputChange(text, 'branchName')}
                            value={bankDetails.branchName}
                            height={30}
                            placeholder="Branch Name"
                            placeholderTextColor={theme.textTertiary}
                        />

                        <Text style={[{ color: theme.textPrimary, marginBottom:16 }, fontStyles.fnt12Regular]}>
                            *By adding this bank account, I agree to T&Cs regarding topping up from bank account.
                        </Text>
                    </View>

                    <TouchableOpacity
                        disabled={!isFormValid}
                        style={[isFormValid ? commonStyles.btnPrimary : commonStyles.btnDisabled]}
                        onPress={updateBankDetails}
                    >
                        <Text style={[{ color: theme.btnText}, fontStyles.fnt16Medium]}>
                            {bankDetails.accountNumber.length === 0 ? 'Add Bank Account' : 'Update Bank Account'}
                        </Text>
                    </TouchableOpacity>

                    <Snackbar
                        style={{ backgroundColor: theme.bgSecondary }}
                        visible={isSnackbarVisible}
                        duration={4000}
                        onDismiss={dismissSnackbar}
                        action={{
                            label: 'OK',
                            labelStyle: { color: '#fff' },
                            onPress: () => { },
                        }}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </View>
            </Provider>
        </ScrollView>
    );
};

export default BankDetails;
