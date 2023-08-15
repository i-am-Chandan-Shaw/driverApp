import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('window');
const style = StyleSheet.create({
   container: {
      height: '100%',
      width: '100%',
      position: 'relative',
      backgroundColor: '#fff'
   },
   backButton: {
      position: 'absolute',
      zIndex: 100,
      top: 5
   },
   bottomContainer: {
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      zIndex: 100,
      position: 'absolute',
      paddingHorizontal: 10,
      flexDirection: 'column',
      alignItems: 'flex-end',
      bottom: 10,
      width: '100%',
   },
   bottomSheetPopup: {
      padding: 10,
      paddingTop: 0
   },
   mapContainer: {
      width: '100%',
      height: height
   },
   dutyContainer: {
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      zIndex: 100,
      backgroundColor: 'transparent',
      marginTop: 5
   },
   cardsContainer: {
      paddingTop:70,
      position: 'absolute',
      height:height,
      zIndex: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 10,
      width:width
   },
   image: {
      height: 376,
      width: 376
   },
   waitingContainer: {
      flexDirection: 'column',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   mediumText: {
      fontSize: 20,
      color: '#000',
      fontFamily: "Poppins-SemiBold",
   },

  

});

export default style;