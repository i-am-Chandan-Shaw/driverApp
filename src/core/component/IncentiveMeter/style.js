import { StyleSheet, Dimensions } from "react-native";
import FontSize from "../../../constants/FontSize";
const { width, height } = Dimensions.get("window");

const style = StyleSheet.create({
  subHeaderText: {
    fontSize: FontSize.medium,
    color: "#333",
    fontWeight:500,
  },
  headerText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.xLarge,
    color: "#000",
  },
  mediumText: {
    fontSize: FontSize.medium,
    color: "#555",
    fontWeight:500
  },
  mainContainer:{
    width:'100%',
    alignSelf:"center",
    marginBottom:20
  },
  topContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:20
  }
});

export default style;
