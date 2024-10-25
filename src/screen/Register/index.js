import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import style from './style';;
import AppTextInput from '../../core/component/AppTextInput';
import { Picker } from '@react-native-picker/picker';
import { Snackbar, Checkbox, Appbar } from 'react-native-paper';
import { post, get } from '../../core/helper/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../core/helper/AppContext';
import AppLoader from '../../core/component/AppLoader';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';
import commonStyles from '../../constants/commonStyle';

const Register = ({ route, navigation }) => {
    const [selectedVehicle, setSelectedVehicle] = useState('tataAce');
    const [checked, setChecked] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackBarText, setSnackBarText] = useState('Please fill all the data');
    const [isLoading, setIsLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const { globalData, setGlobalData } = useContext(AppContext)
    const [registeredData, setRegisterData] = useState({
        driverName: '',
        email: '',
        vehicleType: selectedVehicle,
        vehicleNo: ''
    });

    const handleAlertOK = (data) => {
        // Logic to handle "OK" button press
        navigation.replace('Home', { data });
    };
    const showAlert = (data) => {
        Alert.alert(
            'Registration Successful',
            'Your have successfully registered yourself, Please press OK to continue',
            [
                {
                    text: 'OK',
                    onPress: () => { handleAlertOK(data) },
                },
            ],
            { cancelable: false }
        );
    };



    const registerUser = async () => {
        setIsLoading(true);
        console.log(registeredData);
        try {
            const data = await post(registeredData, 'registerDriver');
            if (data) {
                setIsLoading(false);
                setDriverLocally(data.id);
                setDriverDataLocally(data.id)
                setGlobalData('driverId', data.id);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setValid(isDataValid);

    }, [registeredData]);


    // Set local storage
    const setDriverLocally = async (id) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('driverId', id.toString());
            console.log('Data saved successfully!');
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    const setDriverDataLocally = async (id) => {
        const queryParameter = '?driverId=' + id.toString()
        try {
            const data = await get('getDriver', queryParameter);
            if (data) {
                await AsyncStorage.setItem('driverData', JSON.stringify(data));
                setGlobalData('driverData', data);
                showAlert(data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const validateInputs = (text, type) => {

        let nameRegex = /^[a-zA-Z\s]*$/;
        if (type == 'driverName' && nameRegex.test(text)) {
            setRegisterData({
                ...registeredData,
                [type]: text
            });
        } else if (type != 'driverName') {
            setRegisterData({
                ...registeredData,
                [type]: text
            });
        }


    }

    const isDataValid = () => {
        let isValid = true;
        for (let item in registeredData) {
            if (registeredData[item] == '') {
                isValid = false;
            }
        }
        return isValid
    }

    const validateForm = () => {
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!isDataValid()) {
            setSnackBarText('Please fill all the data');
            setVisible(true);
        } else if (!emailRegex.test(registeredData.email)) {
            setSnackBarText('Invalid Email');
            setVisible(true);
        } else {
            registerUser();
        }

    }

    const handleBackPress = () => {

    }

    const onDismissSnackBar = () => setVisible(false);

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: Colors.bgLight }}>
                    <Appbar.BackAction size={20} onPress={handleBackPress} />
                    <Appbar.Content title="Back" titleStyle={{ fontSize: FontSize.medium }} />
                </Appbar.Header>
                <View style={[commonStyles.mainContainer, commonStyles.p16]}>
                    <ScrollView automaticallyAdjustKeyboardInsets={true}>
                        <View>
                            {isLoading && <AppLoader />}
                            <View>
                                <Text style={[commonStyles.fnt24Medium, commonStyles.textPrimary, commonStyles.mb24]}>Sign up</Text>
                                <View style={{ gap: 20 }}>
                                    <AppTextInput
                                        onChangeText={(text) => validateInputs(text, 'driverName')}
                                        value={registeredData.driverName}
                                        height={50}
                                        placeholder="Full Name"
                                    />
                                    <AppTextInput
                                        onChangeText={(text) => validateInputs(text, 'email')}
                                        value={registeredData.email}
                                        inputMode="email"
                                        height={50}
                                        placeholder="Email"
                                    />
                                    <View style={style.selectBox}>
                                        <Picker
                                            enabled={false}
                                            selectedValue={selectedVehicle}
                                            onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                                        >
                                            <Picker.Item label="Tata Ace" value="tataAce" />
                                        </Picker>
                                    </View>
                                    <AppTextInput
                                        onChangeText={(text) => validateInputs(text, 'vehicleNo')}
                                        value={registeredData.vehicleNo}
                                        height={50}
                                        style={{ textTransform: 'uppercase' }}
                                        placeholder="Vehicle Number"
                                    />
                                    <View style={[commonStyles.rowFlex]}>
                                        <Checkbox
                                            status={checked ? 'checked' : 'unchecked'}
                                            color={Colors.bgPrimary}
                                            onPress={() => {
                                                setChecked(!checked);
                                            }}
                                        />
                                        <Text style={[commonStyles.fnt12Regular, { marginTop: 6, flex: 1 }]}>By signing up. you agree to the Terms of service and Privacy policy.</Text>
                                    </View>
                                </View>

                            </View>
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
                    </ScrollView>
                    <TouchableOpacity disabled={!valid} style={valid ? commonStyles.btnPrimary : commonStyles.btnDisabled} onPress={validateForm}>
                        <Text style={[commonStyles.fnt16Medium, commonStyles.textCenter, commonStyles.textWhite]}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>


    )
}

export default Register;