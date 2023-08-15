import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, TouchableOpacity,Alert } from 'react-native';
import style from './style';;
import AppTextInput from '../../core/component/AppTextInput';
import { Picker } from '@react-native-picker/picker';
import { Snackbar, Provider,ActivityIndicator } from 'react-native-paper';
import { post } from '../../core/helper/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../core/helper/AppContext';

const Register = ({route, navigation }) => {
    const [selectedVehicle, setSelectedVehicle] = useState('tataAce');
    const [visible, setVisible] = useState(false);
    const [snackBarText, setSnackBarText] = useState('Please fill all the data');
    const [isLoading, setIsLoading]=useState(false);
    const [valid,setValid]=useState(false);
    const { globalData, setGlobalData } = useContext(AppContext) 
    const [registeredData, setRegisterData] = useState({
        driverName: '',
        email: '',
        vehicleType: selectedVehicle,
        vehicleNo: ''
    });

    const handleAlertOK = (data) => {
        // Logic to handle "OK" button press
        navigation.replace('Home',{data});
      };
    const showAlert = (data) => {
        Alert.alert(
          'Registration Successful',
          'Your have successfully registered yourself, Please press OK to continue',
          [
            {
              text: 'OK',
              onPress: ()=>{handleAlertOK(data)},
            },
          ],
          { cancelable: false }
        );
      };

   

    const registerUser = async () => {
        setIsLoading(true);
        try {
            const data = await post(registeredData,'registerDriver');
            if (data) {
                setIsLoading(false);
                setDriverLocally(data.id);
                setGlobalData({
                    driverId:data.id,
                    ...globalData
                  });
                showAlert(data)
                
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }

        
    }

    useEffect(()=>{
        setValid(isDataValid);
       
    },[registeredData]);
    useEffect(()=>{
        setRegisterData({
            phone:route.params.phone,
            ...registeredData
        })
    },[])

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

    const isDataValid=()=>{
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

    const onDismissSnackBar = () => setVisible(false);

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={style.container}>
            <Provider>
            <View style={style.mainContainer} onPress={Keyboard.dismiss}>
                <View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }} >
                        <Text style={style.headerText}>Create An Account</Text>
                        <Text style={[style.subHeaderText]} >Let's get you registered ! </Text>
                    </View>
                    <View>
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'driverName')}
                            value={registeredData.driverName}
                            height={50}
                            placeholder="Full Name" />
                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'email')}
                            value={registeredData.email}
                            inputMode="email"
                            height={50}
                            placeholder="Email" />

                        <View style={style.inputStyle}>
                            <Picker
                                enabled={false}
                                selectedValue={selectedVehicle}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedVehicle(itemValue)
                                }>
                                <Picker.Item label="Tata Ace" value="tataAce" />
                            </Picker>
                        </View>

                        <AppTextInput
                            onChangeText={(text) => validateInputs(text, 'vehicleNo')}
                            value={registeredData.vehicleNo}
                            height={50}
                            style={{ textTransform: 'uppercase' }}
                            placeholder="Vehicle Number" />

                    </View>
                    <Text style={style.noteText}>*Vehicle number would be verified after your document verification.</Text>
                </View>

                <TouchableOpacity disabled={!valid}  style={[style.signInButton, !valid ? style.signInButtonDisabled : {}]} onPress={validateForm}>
                    <Text style={[style.signInText, {marginLeft:30}]} >Register
                    </Text>
                    <View style={{width:30}}>
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

export default Register;