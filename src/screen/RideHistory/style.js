import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

const style = StyleSheet.create({
    mainContainer: {
        paddingTop: 10,
    },
    emptyContainer: {
        height: height - 200,
        width: width,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default style;