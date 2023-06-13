import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('window');
const style = StyleSheet.create({
   container:{
      height:'100%',
      width:'100%',
      position:'relative',
      backgroundColor:'#fff'
   },
   backButton:{
      position:'absolute',
      zIndex:100,
      top:5
   },
   bottomContainer:{
      borderTopRightRadius:30,
      borderTopLeftRadius:30,
      zIndex:100,
      position:'absolute',
      paddingHorizontal:10,
      flexDirection:'column',
      alignItems:'flex-end',
      bottom:10,
      width:'100%',
   },
   bottomSheetPopup:{
      padding:10,
      paddingTop:0
   },
   mapContainer:{
      width: '100%', 
      height: height
   },
   dutyOnContainer:{
      backgroundColor:'#222',
      alignSelf:'center',
      position:'absolute',
      top:0,
      zIndex:100,
      borderColor:'#d6d6d6',
      borderWidth:1,
      padding:10,
      paddingHorizontal:20,
      borderRadius:20,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      marginTop:5,
      width:170,
   },
   dutyOffContainer:{
      backgroundColor:'#eee',
      alignSelf:'center',
      position:'absolute',
      top:0,
      zIndex:100,
      borderColor:'#444',
      borderWidth:1,
      padding:10,
      paddingHorizontal:20,
      borderRadius:20,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      marginTop:5,
      width:170,
   },
   image:{
      height:376,
      width:376
   },
   waitingContainer:{
      flexDirection:'column',
      flexGrow:1,
      alignItems:'center',
      justifyContent:'center',
   },
   mediumText:{
      fontSize:20,
      color:'#000',
      fontFamily: "Poppins-SemiBold",
   }
   
});

export default style;