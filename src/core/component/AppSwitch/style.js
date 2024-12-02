import { StyleSheet } from "react-native";
import { useTheme } from "../../../constants/ThemeContext";

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      width: 130,
      height: 35,
      borderRadius: 20,
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
    },
    switchTrack: {
      flex: 1,
      width: "100%",
      height: "100%",
      borderRadius: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.bgPrimaryLight,
    },
    thumb: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.white,
      position: "absolute",
      top: 2,
    },
    textContainer: {
      marginLeft: 8,
    },
    textLeft: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.white,
      left: 25,
    },
    textRight: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.white,
      alignSelf: "center",
      position: "absolute",
      left: 45,
    },
  });
};

export default useStyles;
