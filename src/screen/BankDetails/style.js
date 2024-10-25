import { StyleSheet,Dimensions } from 'react-native';
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";


const { width, height } = Dimensions.get('window');

const Spacing = 10;

const style = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff'
      },
    mainContainer:{
        paddingHorizontal:20,
        paddingVertical:10,
        flex:1,
        justifyContent:'space-between',
        height:height - 59  // Make it dynamic
    },
    headerText: {
        fontSize: 24,
        color: Colors.primary,
        fontFamily: 'Poppins-Bold',
        marginVertical: Spacing,
    },
    subHeaderText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#555',
        textAlign:'left',
    },
    labelText:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.medium,
        color: '#666',
    },
    forgotPasswordText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.small,
        color: Colors.primary,
    },
    signInButton: {
        padding: 12,
        backgroundColor: '#B31312',
        borderRadius: Spacing*3,
        shadowColor: '#B31312',
        shadowOffset: {
            width: 0,
            height: Spacing,
        },
        shadowOpacity: 0.3,
        shadowRadius: Spacing,
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:10
    },
    signInButtonDisabled:{
        opacity:0.5,
    },
    signInText: {
        color: Colors.onPrimary,
        textAlign: "center",
        fontSize: FontSize.medium,
        marginRight:10,
    },
    inputStyle:{
        fontSize: FontSize.medium,
        backgroundColor: Colors.lightPrimary,
        borderRadius: Spacing,
        paddingHorizontal:10,
        borderWidth: 1,
        borderColor:'#d6d6d6',
        height:50,
    },
    noteText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
    },
    snackBar:{
        // backgroundColor: '#9b111e', 
        marginHorizontal:20,
        width:'100%',
    }
});

export default style;