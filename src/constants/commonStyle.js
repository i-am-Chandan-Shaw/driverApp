// commonStyles.js
import { StyleSheet } from "react-native";
import FontSize from "./FontSize";
import { lightTheme } from "./color";

const commonStyles = StyleSheet.create({
  // Button Css Starts
  btnPrimary: {
    padding: 15,
    backgroundColor: lightTheme.bgPrimary,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnDanger: {
    padding: 15,
    backgroundColor: lightTheme.danger,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSuccess: {
    padding: 15,
    backgroundColor: lightTheme.success,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnOutline: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: lightTheme.bgLight,
    borderColor: lightTheme.bgPrimary,
    width: "100%",
  },
  btnSmall: {
    padding: 8,
  },

  btnDisabled: {
    padding: 15,
    backgroundColor: lightTheme.bgPrimary,
    borderRadius: 8,
    opacity: 0.5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  // Button Css Ends

  w50: {
    width: "50%",
  },
  w100p: {
    width: "100%",
  },

  // Fonts starts

  fnt12Medium: {
    fontSize: FontSize.xSmall,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
  fnt12Regular: {
    fontSize: FontSize.xSmall,
    fontFamily: "Poppins",
    color: "#000",
  },

  fnt10Regular: {
    fontSize: FontSize.xxSmall,
    fontFamily: "Poppins",
    lineHeight: 16,
  },

  fnt16Regular: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins",
    color: "#000",
    lineHeight: 24,
  },
  fnt14Medium: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    lineHeight: 23,
  },

  fnt16Medium: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    lineHeight: 23,
  },

  fnt24Medium: {
    fontSize: FontSize.xLarge,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    lineHeight: 30,
  },
  fnt24Bold: {
    fontSize: FontSize.xLarge,
    fontFamily: "Poppins-Bold",
    color: "#000",
    lineHeight: 30,
  },

  // Fonts ends
  textCenter: {
    textAlign: "center",
  },
  textWhite: {
    color: lightTheme.bgLight,
  },
  textPrimary: {
    color: lightTheme.textPrimary,
  },
  textSecondary: {
    color: lightTheme.textSecondary,
  },
  textTertiary: {
    color: lightTheme.textTertiary,
  },
  textDisabled: {
    color: lightTheme.textDisabled,
  },
  textInfo: {
    color: lightTheme.textInfo,
  },

  // Spacing and Margin starts

  p16: {
    padding: 16,
  },
  px30: {
    paddingStart: 30,
    paddingEnd: 30,
  },

  py30: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  pt10: {
    paddingTop: 10,
  },
  pt40: {
    paddingTop: 40,
  },
  pb40: {
    paddingBottom: 40,
  },
  pb12: {
    paddingBottom: 12,
  },

  // Margin

  mt5: { marginTop: 5 },
  mt10: {
    marginTop: 10,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },
  mt30: {
    marginTop: 30,
  },
  mt24: {
    marginTop: 24,
  },

  mb10: {
    marginBottom: 10,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
  mb30: {
    marginBottom: 30,
  },
  mb24: {
    marginBottom: 24,
  },

  // Spacing and Margin ends;

  flex1: {
    flex: 1,
  },
  flexCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  gap1: {
    gap: 4,
  },
  gap2: {
    gap: 8,
  },
  rowFlex: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
  },
  columnCenter: {
    alignItems: "center",
  },

  mainContainer: {
    backgroundColor: lightTheme.bgLight,
    flex: 1,
  },
});

export default commonStyles;
