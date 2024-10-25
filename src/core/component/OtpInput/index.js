import React, { useState, useRef } from 'react';
import {
    View, Modal,
    TextInput,
    TouchableOpacity,
    Text,
    Keyboard
} from 'react-native';
import ANTIcon from 'react-native-vector-icons/AntDesign';
import style from './style';

const OtpInput = ({ visible, onClose, expectedOtp }) => {
    const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const otpInputs = Array.from({ length: 6 });

    const inputRefs = otpInputs.map(() => useRef(null));

    const handleInputChange = (index, value) => {
        if (!/^\d+$/.test(value) && value !== '') {
            return
        }
        setError(false)
        if (value.length === 1 && index < 5) {
            inputRefs[index + 1].current.focus();
        }


        const newOtp = [...enteredOtp];
        newOtp[index] = value;
        setEnteredOtp(newOtp);
    };

    const handleValidation = () => {
        const enteredOtp = enteredOtp.join('');
        if (enteredOtp == expectedOtp) {
            setError(false);
            // Perform successful action here
            let status = 'accepted'
            onClose(status);
        } else {
            onClose(status);
            setError(true);
            setEnteredOtp(['', '', '', '', '', '']);
            Keyboard.dismiss();
        }
    };


    return (
        <View >
            <View style={style.otpContainer}>
                {otpInputs.map((_, index) => (
                    <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        style={[
                            style.otpInput,
                            error && style.otpInputError,
                            enteredOtp[index] && style.otpInputFilled,
                        ]}
                        value={enteredOtp[index]}
                        onChangeText={value => handleInputChange(index, value)}
                        keyboardType="number-pad"
                        maxLength={1}

                    />
                ))}
            </View>
            {error && <View style={{ marginBottom: 10, alignSelf: 'center' }}>
                <Text style={{ color: "red", fontSize: 12 }}>*Invalid OTP</Text>
            </View>}
        </View>
    )
}

export default OtpInput;