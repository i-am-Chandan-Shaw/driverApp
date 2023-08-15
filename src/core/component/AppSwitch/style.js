import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    container: {
        width: 150, // Customize the width of the switch
        height: 40, // Customize the height of the switch
        borderRadius: 25, // Half of the height to make it rounded
        backgroundColor: 'transparent', // Background color of the switch
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      switchTrack: {
        flex: 1,
        width:'100%',
        height: '100%',
        borderRadius: 25,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
      },
      thumb: {
        width: 35, // Customize the width of the thumb
        height: 35, // Customize the height of the thumb
        borderRadius: 20, // Half of the height to make it rounded
        backgroundColor: '#fff', // Thumb color
        position: 'absolute',
        top: 2,
      },
      textContainer: {
        marginLeft: 10,
      },
      textLeft: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        left:30 
      },
      textRight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        alignSelf:'center',
        position:'absolute',
        left:50
      },
});

export default style;