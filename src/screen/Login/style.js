import { StyleSheet } from 'react-native';
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";

const Spacing = 10;
const style = StyleSheet.create({
    mainContainer: {
        height: '100%',
        padding: 20
    },
    headerContainer: {
        alignItems: 'center'
    },
    headerText: {
        fontSize: FontSize.xLarge,
        color: Colors.primary,
        fontFamily: 'Poppins-Bold',
        marginVertical: Spacing * 3,
    },
    subHeaderText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.large,
        maxWidth: "100%",
        textAlign: "center",
        color: '#000',
    },
    smallText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.small,
        textAlign: 'center',
        maxWidth: '80%',
        marginTop: 10,
        color: '#444'
    },
    forgotPasswordText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.small,
        color: Colors.primary,
        alignSelf: "flex-end",
    },
    signInButton: {
        padding: Spacing * 1.4,
        backgroundColor: Colors.primary,
        borderRadius: Spacing,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: Spacing,
        },
        shadowOpacity: 0.3,
        shadowRadius: Spacing,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signInButtonDisabled: {
        opacity: 0.5,
        padding: Spacing * 1.4,
        backgroundColor: Colors.primary,
        borderRadius: Spacing,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: Spacing,
        },
        shadowOpacity: 0.3,
        shadowRadius: Spacing,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signInText: {
        color: Colors.onPrimary,
        textAlign: "center",
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.medium,
        marginRight: 10
    },
    semiboldText: {
        fontFamily: 'Poppins-SemiBold',
        color: Colors.text,
        textAlign: "center",
        fontSize: FontSize.small,
    },
    resendText: {
        fontFamily: 'Poppins',
        color: '#444',
        textAlign: "center",
        fontSize: FontSize.medium,

    },
    disabledText: {
        opacity: 0.3
    },
    activeText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'green',
        textAlign: "center",
        fontSize: FontSize.medium,
    },
    iconsContainer: {
        marginTop: Spacing,
        flexDirection: "row",
        justifyContent: "center",
    },
    iconStyle: {
        padding: Spacing,
        backgroundColor: Colors.gray,
        borderRadius: Spacing / 2,
        marginHorizontal: Spacing,
    },
    editPhone: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        padding: 20,
        elevation: 5,
        opacity: 1,
        zIndex: 100,
        borderRadius: 8
    }
});

export default style;