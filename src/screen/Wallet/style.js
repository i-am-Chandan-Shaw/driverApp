import { StyleSheet, Dimensions } from "react-native";
import FontSize from "../../constants/FontSize";
const { width, height } = Dimensions.get("window");

const style = StyleSheet.create({
  container: {
  },
  balanceContainer: {
    alignSelf:'center',
    flexDirection:'column',
    alignItems:'center',
    width:width*0.92,
    padding:20,
    backgroundColor: '#fff',
    borderTopRightRadius: 8,
    borderTopLeftRadius:8,
    marginVertical: 10,
    elevation:5,
  },
  subHeaderText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.large,
    color: "#000",

  },
  headerText: {
    fontSize: FontSize.xLarge,
    color: "#000",
    fontWeight:700
  },
  mediumText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.medium,
    color: "#000",
  },
  smallText:{
    fontSize: FontSize.small,
    color: "#000",
    fontWeight:500
  },
  xSmallText:{
    fontSize: 11,
    color: "#000",
  },
  subheaderContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignSelf:'center',
    marginTop:15,
    width:width*0.92,
  },
  imageContainer:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#111',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  columnCenter:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  },
  rowCenter:{
    flexDirection:'row',
    alignItems:'center',
  },
  transactionContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: '#fff',
    borderRadius:6,
    padding:15,
    paddingRight:5,
    marginTop:10
  },
  bottomContainer:{
    width:width*0.92,
    alignSelf:'center',
    marginTop:30,
  },
  scrollContainer:{
    height: height - 360,
    marginBottom:10,
  }
});

export default style;