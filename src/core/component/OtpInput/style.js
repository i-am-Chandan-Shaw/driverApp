import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginBottom:10
    },
    otpInput: {
        borderWidth: 1,
        borderColor: Colors.bgInfo,
        width: 50,
        height: 50,
        fontSize: 20,
        textAlign: 'center',
        borderRadius:15,
        fontWeight:'bold'
    },
    otpInputFilled: {
        borderColor: Colors.bgPrimary,
    },
    otpInputError: {
        borderColor: 'red',
      },
 
});

export default style;