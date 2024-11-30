import { StyleSheet, Dimensions } from "react-native";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
const { width, height } = Dimensions.get("window");

const Spacing = 10;

const style = StyleSheet.create({
  selectBox: {
    fontSize: FontSize.medium,
    backgroundColor: "#f9f9f9",
    borderRadius: Spacing,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    height: 60,
  },
  snackBar: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "red",
  },
});

export default style;
