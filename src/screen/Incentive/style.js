import { StyleSheet, Dimensions } from "react-native";
import FontSize from "../../constants/FontSize";
const { width, height } = Dimensions.get("window");

const style = StyleSheet.create({
  subHeaderText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.large,
    color: "#000",

  },
  headerText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.xLarge,
    color: "#000",
  },
  mediumText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.medium,
    color: "#000",
  },
  headerContainer: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  offerBanner: {
    width: width * 0.92,
    backgroundColor: "#ffd700",
    alignSelf: "center",
    padding: 20,
    borderRadius: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  whiteBanner: {
    alignSelf: "center",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10
  },
  incentiveContainer: {
    width: width * 0.92,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
    elevation: 5
  }
});

export default style;
