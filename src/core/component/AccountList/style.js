import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
   list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 12,

   },
   leftSection: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
   },
   rightSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   listIcon: {
      height: 30,
      width: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#19A7CE',
      borderRadius: 30,
      marginRight: 15
   },
   listTitle: {
      fontSize: 14,
      fontWeight: 500,
      color: '#333'
   },
   listDescription: {
      fontSize: 12,
      color: '#333'
   },
   button: {
      height: 30,
      borderColor: '#d6d6d6',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
      backgroundColor: 'transparent',
      borderRadius:15
   },
   buttonText: {
      fontSize: 12,
      color: '#0047ab',
      textAlign: 'center',
   },
});

export default style;