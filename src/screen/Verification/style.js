import { StyleSheet,Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


const style = StyleSheet.create({
    mainContainer:{
        alignSelf:'center',
        flexDirection:'column',
        justifyContent:'space-between',
        height:'100%',
        padding:20,
        marginRight:-20
    },
    uploadCardContainer:{
        width:width*0.9,
        alignSelf:'center',
        marginBottom:10,
        marginTop:10
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
     footerContainer:{
      
     }
});

export default style;