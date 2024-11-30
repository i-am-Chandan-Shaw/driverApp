import React from "react";
import { View, Text } from "react-native";
import style from "./style";
import IncentiveMeter from "../../core/component/IncentiveMeter";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../constants/ThemeContext";

const Incentive = () => {
  const { theme } = useTheme();

  const incentiveData = {
    id: 0,
    ridesCompleted: 0,
    incentivesList: [
      {
        id: 0,
        amount: 100,
        totalRides: 4,
      },
      {
        id: 1,
        amount: 300,
        totalRides: 8,
      },
      {
        id: 2,
        amount: 500,
        totalRides: 12,
      },
    ],
  };

  let incentiveArr = incentiveData.incentivesList.map((item) => (
    <View key={item.id}>
      <IncentiveMeter
        ridesCompleted={incentiveData.ridesCompleted}
        data={item}
      />
    </View>
  ));
  return (
    <View>
      <View style={[style.headerContainer, { backgroundColor: theme.bgLight }]}>
        <Text style={[style.subHeaderText, { color: theme.bgDark }]}>
          Incentives
        </Text>
      </View>
      <View style={style.offerBanner}>
        <Text style={[style.headerText, { color: "#000" }]}>
          Earn a guaranteed ₹300
        </Text>
        <Text style={[style.mediumText, { color: "#000" }]}>
          for every ride valued at ₹200 or less
        </Text>
        <View style={style.whiteBanner}>
          <Text style={style.mediumText}>Start earning now!</Text>
        </View>
      </View>
      <ScrollView
        style={[style.incentiveContainer]}
        keyboardShouldPersistTaps="never"
      >
        {incentiveArr}
      </ScrollView>
    </View>
  );
};

export default Incentive;
