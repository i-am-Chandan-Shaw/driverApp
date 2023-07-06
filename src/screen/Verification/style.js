import { StyleSheet,Dimensions } from 'react-native';
import FontSize from '../../constants/FontSize';
const { width, height } = Dimensions.get('window');


const style = StyleSheet.create({
    docContainer:{
        alignSelf:'center',
        flexDirection:'column',
        justifyContent:'space-between',
        height:'100%',
        padding:20,
        marginRight:-20
    },
    submitContainer:{
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      height:'100%',
      width:'100%',
      backgroundColor:'#fff'
    },
    headerText: {
      fontFamily: "Poppins-SemiBold",
      fontSize: 24,
      color: "#000",
      marginTop:20,
      width:'60%'
    },
    subHeaderText: {
      marginTop:20,
      fontFamily: "Poppins-SemiBold",
      fontSize:12,
      width:'80%',
      marginTop:10
    },
    uploadCardContainer:{
        width:width*0.9,
        alignSelf:'center',
        marginBottom:10,
        marginTop:10,
        marginBottom:20
    },
     uploadCard:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#888',
        borderStyle:'dashed',
        borderWidth:1,
        width:width*0.9,
        alignSelf:'center',
        height:200,
        borderRadius:15
     },
     mediumText:{
        color:'#000',
        fontSize:16,
     },
     largeText:{
      color:'#000',
      fontSize:18,
      fontWeight:600
   },
     smallText:{
        color:'#666',
        fontSize:12,
     },
     img:{
        width:width*0.9,
        height:200,
        alignSelf:'center',
        borderRadius:15
     },
     closeIcon:{
        position:'absolute',
        right:10,
        top:10
     },
     cameraOption:{
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'center',
      paddingVertical:15,
     },
     bottomSheetPopup:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      height:'100%'
     },
   
});

export default style;