import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    loaderContainer: {
        width: 70,
        height: 70,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgDark, // Adjust color as needed
    },
});

export default style;