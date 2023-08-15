import React from 'react';
import { View } from 'react-native';
import style from './style';
import { ActivityIndicator } from 'react-native-paper';

const AppLoader=({styles})=>{
return (
    <View style={[style.loaderContainer, styles]}>
        <ActivityIndicator size={35} animating={true} color={'#fff'} />
    </View>
    )
}

export default AppLoader;