import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import style from './style';;
import AppTextInput from '../../core/component/AppTextInput';
import { Picker } from '@react-native-picker/picker';
import { Snackbar, Provider, ActivityIndicator } from 'react-native-paper';
import { patch } from '../../core/helper/services';
import { AppContext } from '../../core/helper/AppContext';

const BankDetails = () => {
    const { globalData, setGlobalData } = useContext(AppContext)
    useEffect(() => {
        console.log('Bank screen==>', globalData?.driverId);
    }, [globalData])

    const [accountType, setAccountType] = useState('saving');
    const [visible, setVisible] = useState(false);
    const [snackBarText, setSnackBarText] = useState('Please fill all the data');
    const [isLoading, setIsLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        id:globalData?.driverId,
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        branchName: '',
        swiftCode: '',
        city: '',
        accountType: accountType
    });

    useEffect(()=>{
        setValid(isDataValid);
    },[bankDetails])

    const updateBankDetails = async () => {
        setIsLoading(true);
        try {
            const data = await patch(bankDetails, 'patchDriver');
            if (data) {
                console.log(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
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
            }else{
                setBankDetails({
                    ...bankDetails,
                    [type]: text
                });
            }
           
        }


       

    }

    const isDataValid = (data) => {
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
                <View style={style.mainContainer} onPress={Keyboard.dismiss}>
                    <View>
                        <Text style={[style.subHeaderText]} >Account Information: </Text>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'accountHolderName')}
                            value={bankDetails.accountHolderName}
                            height={50}
                            placeholder="Account Holder Name" />
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'accountNumber')}
                            value={bankDetails.accountNumber}
                            height={50}
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
                            height={50}
                            placeholder="Bank Name" />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <AppTextInput
                                onChangeText={(text) => validateInputs(text, 'swiftCode')}
                                value={bankDetails.swiftCode}
                                height={50}
                                style={{ width: '48%', textTransform: 'uppercase' }}
                                placeholder="IFSC CODE" />
                            <AppTextInput
                                onChangeText={(text) => validateInputs(text, 'city')}
                                value={bankDetails.city}
                                height={50}
                                style={{ width: '48%' }}
                                placeholder="City" />
                        </View>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'branchName')}
                            value={bankDetails.branchName}
                            height={50}
                            style={{ marginBottom: 20 }}
                            placeholder="Branch Name" />

                        <Text style={style.noteText}>*By adding this bank account, I agree to T&Cs regarding topping up from bank account..</Text>
                    </View>

                    <TouchableOpacity disabled={!valid}  style={[style.signInButton, !valid ? style.signInButtonDisabled : {}]} onPress={updateBankDetails}>
                        <View style={{ width: 30 }} />
                        <Text style={style.signInText} >Add Bank Account
                        </Text>
                        <View style={{ width: 30 }}>
                            {isLoading && <ActivityIndicator animating={true} color={'#fff'} />}
                        </View>
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