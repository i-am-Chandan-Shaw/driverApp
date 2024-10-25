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
      paddingTop: 70,
      position: 'absolute',
      height: height,
      zIndex: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 10,
      width: width
   },
   image: {
      height: 230,
      width: 300
   },
   waitingContainer: {
      flexDirection: 'column',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   mediumText: {
      fontSize: 16,
      color: '#000',
      fontFamily: "Poppins-SemiBold",
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
   },
   snackBar: {
      marginHorizontal: 20,
      zIndex:10000,
      position:'absolute',
      bottom:10
   }


});

export default style;