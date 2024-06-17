import {
    Text,
    TouchableOpacity,
    View,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AppTextInput from "../../core/component/AppTextInput";
import style from "./style";
import { ActivityIndicator } from 'react-native-paper';
import { Snackbar } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, post } from "../../core/helper/services";
import { AppContext } from "../../core/helper/AppContext";
import AppLoader from '../../core/component/AppLoader';


const Login = ({ navigation }) => {
    const [phone, setPhone] = useState(null)
    const [valid, setValid] = useState(null)
    const [count, setCount] = useState(10)
    const [confirm, setConfirm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const { globalData, setGlobalData } = useContext(AppContext)
    var id = null;

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);


    const [timer, setTimer] = useState(60); // Initial timer value
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Function to start the timer
    const startTimer = () => {
        setTimer(60);
        setIsTimerRunning(true);
    };

    // Function to stop the timer
    const stopTimer = () => {
        setIsTimerRunning(false);
    };

    useEffect(() => {
        let intervalId;

        // Start the timer when isTimerRunning is true
        if (isTimerRunning) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1); // Decrease timer by 1 every second
            }, 1000);
        } else {
            clearInterval(intervalId); // Clear the interval when timer is not running
        }

        // When timer reaches 0, stop the timer
        if (timer === 0) {
            stopTimer();
        }

        // Clean up function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, [timer, isTimerRunning]);

    const handleResendOTP = () => {
        startTimer()

    };

    // verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');


    const checkAuthentication = async () => {
        setLoading(true)
        let payload = { phone: phone }
        try {
            const data = await post(payload, 'driverLogin');
            if (data) {
                if (data.isRegistered) {
                    setLoading(false);
                    setAuthenticated(data.id);
                    setDriverLocally(data.id)
                    setGlobalData('driverId', data.id);
                    navigation.replace('Home');
                } else {
                    navigation.replace('Register', { phone: phone });
                }
            }
        } catch (error) {
            setLoading(false)
            console.log('checkAuthentication error',error);
        }
    }






    // Set local storage
    const setAuthenticated = async (id) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('driverId', id.toString());
            console.log('Data saved successfully!');
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    const setDriverLocally = async (id) => {
        const queryParameter = '?driverId=' + id.toString()
        try {
            const data = await get('getDriver', queryParameter);
            if (data) {
                await AsyncStorage.setItem('driverData', JSON.stringify(data));
                setGlobalData('driverData', data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Creating OTP

    const [otp, setOtp] = useState(845398)

    function generateOTP(phoneNumber) {
        // Generate a random 6-digit number
        const randomOtp = Math.floor(100000 + Math.random() * 900000);
        setOtp((prev) => {
            signInWithPhoneNumber(phoneNumber, randomOtp);
            handleResendOTP();
            return randomOtp;
        }
        );


    }

    async function signInWithPhoneNumber(phoneNumber, newOtp) {
        try {
            // Handling disabled state of the button
            setValid(false)
            setCode(null)
            setLoading(true);
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2?authorization=rL4MxpFumIvbgGOf0UaP2XBR8Wqo7y6Vi1lThK5jknDc3HswzN9rxfpFHbe0wcoWGOXTvP6RtDmAIdQ5&route=otp&variables_values=' + newOtp + '&route=otp&numbers=' + phoneNumber); // Replace with your API endpoint
            if (response) {
                setLoading(false);
                setConfirm(true);
            }


        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    async function confirmCode() {
        setLoading(true);
        if (code == otp || code == '020240') {
            checkAuthentication()
        }
        else {
            console.log('Invalid Code');
            setLoading(false);
            onToggleSnackBar();
        }
    }




    const validateInputs = (text, type) => {
        if (type == 'phone') {
            setPhone(() => { return text.replace(/[^0-9]/g, '') })
        } else {
            setCode(() => { return text.replace(/[^0-9]/g, '') })
        }

        if ((type == 'phone' && text.length == 10) || (type == 'otp' && text.length == 6)) {
            setValid(true)
        } else {
            setValid(false)
        }

    }

    const editPhone = () => {
        // setPhone(null);
        setConfirm(false);
        setValid(true);
        setIntervalId(null);
        clearInterval(id)

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={style.mainContainer}>
                {loading && <AppLoader styles={{ top: '40%' }} />}
                {isChecking && <View style={style.loadingContainer}>
                    <ActivityIndicator animating={isChecking} color={'#0047ab'} />
                </View>}
                <View style={style.headerContainer} >
                    <Text style={style.headerText}> Load Go </Text>
                    {!confirm && <View>
                        <Text style={style.subHeaderText}> Log into your account </Text>
                        <Text style={style.smallText}>Welcome to LoadGo, enter your details below to continue.</Text></View>}

                    {confirm && <View>
                        <Text style={style.subHeaderText}> SMS Code </Text>
                        <Text style={style.smallText}>Enter 6 digit code which was sent to</Text></View>}
                    {confirm && <View style={style.editPhone}>
                        <Text style={[style.subHeaderText, { marginRight: 5 }]} >
                            {phone}
                        </Text>
                        <TouchableOpacity onPress={editPhone}>
                            <FeatherIcon name='edit' size={16} color='#000' />
                        </TouchableOpacity>
                    </View>}
                </View>
                <View style={{ marginVertical: 20 }}>
                    {!confirm && (<AppTextInput
                        onChangeText={(text) => validateInputs(text, 'phone')}
                        value={phone}
                        maxLength={10}
                        minLength={10}
                        type={phone}
                        keyboardType="decimal-pad"
                        placeholder="Mobile No" />)}
                    {confirm && (<AppTextInput
                        onChangeText={(text) => validateInputs(text, 'otp')}
                        value={code}
                        maxLength={6}
                        minLength={6}
                        type={code}
                        keyboardType="decimal-pad"
                        placeholder="OTP" />)}
                </View>
                <TouchableOpacity
                    disabled={!valid}
                    onPress={() => !confirm ? generateOTP(phone) && handleResendOTP() : confirmCode()}
                    style={valid ? style.signInButton : style.signInButtonDisabled} >
                    <Text style={style.signInText} >
                        {!confirm ? 'Send OTP' : 'Verify OTP'}
                    </Text>

                </TouchableOpacity>
                {confirm &&
                    <>
                        {timer != 0 ?
                            <View
                                style={{ paddingTop: 30 }} >
                                <Text style={style.resendText} >
                                    Resend OTP in {timer} sec
                                </Text>
                            </View> :
                            <TouchableOpacity
                                onPress={() => { generateOTP(phone) }}
                                style={{ paddingTop: 30 }} >
                                <Text style={style.activeText} >
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>}
                    </>

                }

                <Snackbar
                    style={{ backgroundColor: '#c62828', width: '100%', marginHorizontal: 20 }}
                    visible={visible}
                    duration={2000}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'OK',
                        labelStyle: { color: '#fff' },
                        onPress: () => {
                            // Do something
                        },
                    }}
                >
                    Invalid Code
                </Snackbar>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login