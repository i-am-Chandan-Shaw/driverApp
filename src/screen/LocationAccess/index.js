import React from 'react';
import { Image, Text, View } from 'react-native';
import imagePath from '../../constants/imagePath';
import style from './style';
import { Button } from 'react-native-paper';
const LocationAccess = ({onPress}) => {
    return (
        <View style={style.mainContainer}>
            <Image style={{ height: 200, width: 200 }} source={imagePath.locationAccess} />
            <Text style={style.headerText}>Allow your location</Text>
            <Text style={style.subHeaderText}>We will need your location to
                give you better experience</Text>
            <Button mode='contained' onPress={onPress} buttonColor='#FE7A52' style={{padding:5, borderRadius:70}}>Enable Location Service</Button>
            <Text style={style.mediumText}>To allow access go to App Info &gt; Permissions &gt; Allow Location service & try again</Text>
        </View>
    )
}

export default LocationAccess;