import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
const style = StyleSheet.create({
  subHeaderText: {
    fontSize: 20,
    color: "#228b22",
    lineHeight: 20,
    fontWeight: 700,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerText: {
    fontSize: 16,
    color: "#000",
  },
  cards: {
    alignSelf: "center",
    width: width - 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
  },
  indicatorContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    zIndex: 100,
    alignSelf: "center",
    top: "50%",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 15,
  },
  timeLine: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  locationText: {
    paddingHorizontal: 10,
  },
  text: {
    color: "#000000",
    fontSize: 12,
  },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: "#D21F3C",
    borderRadius: 4,
  },
  dottedLine: {
    width: 1,
    height: 70,
    borderLeftColor: "#778899",
    borderLeftWidth: 2,
    borderStyle: "dotted",
  },
  mediumText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 19,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#ddd",
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    color: "#000",
    fontWeight: 500,
  },
});

export default style;
