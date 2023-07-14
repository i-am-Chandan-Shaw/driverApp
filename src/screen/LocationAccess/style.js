import { StyleSheet } from 'react-native'
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";


const Spacing=10;
const style = StyleSheet.create({
    mainContainer:{
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        padding:30
    },
    headerText: {
        fontSize: 24,
        color: Colors.primary,
        fontFamily: 'Poppins-Bold',
        marginTop: Spacing * 3,
    },
    subHeaderText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: FontSize.small,
        color: '#333',
        textAlign:'center',
        marginTop:10,
        marginBottom:30,
        width:'80%'
    },
    mediumText:{
        marginVertical:Spacing*3,
        textAlign:'center',
        fontSize:14,
        color:'#333',
        fontWeight:500,
        lineHeight:22

    }
});

export default style;