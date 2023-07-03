import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    dayContainer: {
        backgroundColor: '#fff',
        height: 50,
        width: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d6d6d6',
        fontSize: 10,
    },
    iconContainer:{
        height:50,
        marginHorizontal:5
    },
    highlightedDate:{
        color:'#fff',
        backgroundColor:'#0B6623',
        // fontSize:10
    },
    mainContainer:{
        height:60,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',

    },
    innerStyle:{
        flex:1,
        
    }
});

export default style;