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

const OtpValidator = ({ visible, onClose, expectedOtp }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const otpInputs = Array.from({ length: 4 });

    const inputRefs = otpInputs.map(() => useRef(null));

    const handleInputChange = (index, value) => {
        setError(false)
        if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current.focus();
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleValidation = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp == expectedOtp) {
            setError(false);
            // Perform successful action here
            let status = 'accepted'
            onClose(status);
        } else {
            setError(true);
            setOtp(['', '', '', '']);
            Keyboard.dismiss();
        }
    };


    return (
        <Modal visible={visible} transparent>
            <View style={style.modalContainer}>
                <View style={style.modalContent}>
                    <Text>Enter OTP</Text>
                    <TouchableOpacity onPress={onClose} style={style.closeButton}>
                        <ANTIcon name="close" size={20} color={'#000'} />
                    </TouchableOpacity>
                    <View style={style.otpContainer}>
                        {otpInputs.map((_, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs[index]}
                                style={[
                                    style.otpInput,
                                    error && style.otpInputError,
                                    otp[index] && style.otpInputFilled,
                                ]}
                                value={otp[index]}
                                onChangeText={value => handleInputChange(index, value)}
                                keyboardType="number-pad"
                                maxLength={1}
                            />
                        ))}
                    </View>
                    {error && <View style={{marginBottom:10, alignSelf:'center'}}>
                        <Text style={{color:"red", fontSize:12}}>*Invalid OTP</Text>
                    </View>}

                    <TouchableOpacity onPress={handleValidation} style={style.submitButton}>
                        <Text style={style.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default OtpValidator;