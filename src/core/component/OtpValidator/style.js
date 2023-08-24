import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        elevation:5
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginBottom:10
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#bbb',
        width: 50,
        height: 50,
        fontSize: 20,
        textAlign: 'center',
        borderRadius:15,
        fontWeight:'bold'
    },
    otpInputFilled: {
        borderColor: '#4773fa',
    },
    otpInputError: {
        borderColor: 'red',
      },
    submitButton: {
        backgroundColor: '#4773fa',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default style;