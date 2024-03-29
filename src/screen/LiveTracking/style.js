import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
   container: {
      height: '100%',
      width: '100%',
      position: 'relative',
   },
   mapContainer: {
      width: '100%',
      height: height - 185
   },
   header: {
      position: 'absolute',
      zIndex: 10,
      padding: 10,
      width: '100%',
      paddingTop:0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

   },
   radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10
   },
   bottomContainer: {
      position: 'absolute',
      top: height - 175 - 65,
      width:'100%'
   },
   navContainer: {
      padding: 10,
      paddingHorizontal: 12,
      margin: 10,
      position: 'absolute',
      zIndex: 100,
      width: '95%',
      alignSelf: 'center',
      flexDirection: 'row',
      backgroundColor: 'rgba(0, 128, 0,1)',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 8
   },
   viewButton: {
      backgroundColor: '#fff',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5
   }
});

export default style;