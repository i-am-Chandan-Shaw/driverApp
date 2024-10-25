import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import style from './style';;
import AppTextInput from '../../core/component/AppTextInput';
import { Picker } from '@react-native-picker/picker';
import { Snackbar, Provider, ActivityIndicator } from 'react-native-paper';
import { get, patch } from '../../core/helper/services';
import { AppContext } from '../../core/helper/AppContext';
import AppLoader from '../../core/component/AppLoader';

const BankDetails = () => {
    const { globalData, setGlobalData } = useContext(AppContext)

    const [accountType, setAccountType] = useState('saving');
    const [visible, setVisible] = useState(false);
    const [snackBarText, setSnackBarText] = useState('Please fill all the data');
    const [isLoading, setIsLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        id: globalData?.driverId,
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        branchName: '',
        swiftCode: '',
        bankLocation: '',
        accountType: accountType
    });

    useEffect(() => {
        setDriverLocally(globalData?.driverId);
        setValid(isDataValid)
    }, [])

    useEffect(() => {
        setValid(isDataValid)
    }, [bankDetails])

    const updateBankDetails = async () => {
        setIsLoading(true);
        Keyboard.dismiss();
        try {
            const data = await patch(bankDetails, 'patchDriver');
            if (data) {
                setSnackBarText('Bank Details Updated')
                setVisible(true)
                setIsLoading(false);
                setValid(false)

            }
        } catch (error) {
            console.log('updateBankDetails',error);
            setIsLoading(false);
        }


    }

    const setDriverLocally = async (id) => {
        setIsLoading(true)
        const queryParameter = '?driverId=' + id.toString()
        try {
            const data = await get('getDriver', queryParameter);
            if (data) {
                setBankDetails({
                    id: globalData?.driverId,
                    accountHolderName: data[0].accountHolderName,
                    bankName: data[0].bankName,
                    accountNumber: data[0].accountNumber == 0 ? '' : data[0].accountNumber,
                    branchName: data[0].branchName,
                    swiftCode: data[0].swiftCode,
                    bankLocation: data[0].bankLocation,
                    accountType: data[0].accountType == '' ? accountType : data[0].accountType
                })
                setIsLoading(false);

            }
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    const validateInputs = (text, type) => {

        let nameRegex = /^[a-zA-Z\s]*$/;
        if ((type != 'accountNumber' || type != 'swiftCode') && nameRegex.test(text)) {
            setBankDetails({
                ...bankDetails,
                [type]: text
            });
        } else if (type == 'accountNumber' || type == 'swiftCode') {
            if (type == 'accountNumber') {
                setBankDetails({
                    ...bankDetails,
                    [type]: text.replace(/[^0-9]/g, '')
                });
            } else {
                setBankDetails({
                    ...bankDetails,
                    [type]: text
                });
            }

        }




    }

    const isDataValid = () => {
        let isValid = true;
        for (let item in bankDetails) {
            if (bankDetails[item] == '') {
                isValid = false;
            }
        }
        return isValid
    }

    const onDismissSnackBar = () => setVisible(false);

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={style.container}>
            <Provider>
                {isLoading && <AppLoader styles={{ top: '40%' }} />}
                <View style={style.mainContainer} onPress={Keyboard.dismiss}>
                    <View style={{ gap: 20 }}>
                        <Text style={[style.subHeaderText]} >Account Information: </Text>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'accountHolderName')}
                            value={bankDetails.accountHolderName}
                            height={30}
                            placeholder="Account Holder Name" />
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'accountNumber')}
                            value={bankDetails.accountNumber}
                            height={30}
                            keyboardType="decimal-pad"
                            placeholder="Account Number" />
                        <View style={style.inputStyle}>
                            <Picker
                                style={{ position: 'relative', top: -5 }}
                                selectedValue={accountType}
                                onValueChange={(itemValue, itemIndex) =>
                                    setAccountType(itemValue)
                                }>
                                <Picker.Item label="Saving" value="saving" />
                                <Picker.Item label="Current" value="current" />
                            </Picker>
                        </View>

                        <Text style={[style.subHeaderText]} >Bank Information: </Text>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'bankName')}
                            value={bankDetails.bankName}
                            height={30}
                            placeholder="Bank Name" />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <AppTextInput
                                onChangeText={(text) => validateInputs(text, 'swiftCode')}
                                value={bankDetails.swiftCode}
                                height={30}
                                style={{ width: '48%', textTransform: 'uppercase' }}
                                placeholder="IFSC CODE" />
                            <AppTextInput
                                onChangeText={(text) => validateInputs(text, 'bankLocation')}
                                value={bankDetails.bankLocation}
                                height={30}
                                style={{ width: '48%' }}
                                placeholder="City" />
                        </View>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'branchName')}
                            value={bankDetails.branchName}
                            height={30}
                            style={{ marginBottom: 20 }}
                            placeholder="Branch Name" />

                        <Text style={style.noteText}>*By adding this bank account, I agree to T&Cs regarding topping up from bank account..</Text>
                    </View>

                    <TouchableOpacity disabled={!valid} style={[style.signInButton, !valid ? style.signInButtonDisabled : {}]} onPress={updateBankDetails}>
                        <View style={{ width: 30 }} />
                        <Text style={style.signInText} >{bankDetails.accountNumber.length == 0 ? 'Add Bank Account' : 'Update Bank Account'}
                        </Text>
                    </TouchableOpacity>
                    <Snackbar
                        style={style.snackBar}
                        visible={visible}
                        duration={4000}
                        onDismiss={onDismissSnackBar}
                        action={{
                            label: 'OK',
                            labelStyle: { color: '#fff' },
                            onPress: () => {
                                // Do something
                            },
                        }}
                    >
                        {snackBarText}
                    </Snackbar>
                </View>

            </Provider>
        </ScrollView>

    )
}

export default BankDetails;