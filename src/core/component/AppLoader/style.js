import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
     loaderContainer:{
        width:70,
        height:70,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',
        position:'absolute',
        zIndex:100,
        alignSelf:'center',
        top:'50%'
    },
});

export default style;