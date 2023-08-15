import { StyleSheet,Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
    bottomContainer:{
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
     numberPlateContainer:{
        borderColor:'#ddd',
        borderWidth:1,
        alignSelf:'flex-start',
        padding:7,
        borderRadius:5,
        marginTop:10
     },
     alignCenter:{
        flexDirection:'row',
        alignItems:'center'
     },
     topContainer:{
        padding:10,
        paddingVertical:15,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        marginBottom:10
     },
     phoneContainer:{
        alignSelf:'flex-start',
        padding:8,
        elevation:3,
        backgroundColor:'#77dd77',
        borderRadius:8
     },
     text: {
      fontSize: 18,
      marginBottom: 20,
    },
    slider: {
      width: width * 0.75,
      height: 60,
      backgroundColor: '#4773fa',
      borderRadius: 30,
      overflow: 'hidden',
    },
    track: {
      height: 40,
      backgroundColor: '#4773fa', // Fill color of the track
    },
    thumb: {
      position: 'absolute',
      width: 55,
      height: 55,
      borderRadius: 30,
      backgroundColor: '#fff',
      top:2.5,
      marginLeft:2,
      justifyContent:'center',
      alignItems:'center'
    },
    sliderText:{
      position:'absolute', 
      left:50,
      top:17,
      fontSize:16,
      color:'#fff'
    }
});

export default style;