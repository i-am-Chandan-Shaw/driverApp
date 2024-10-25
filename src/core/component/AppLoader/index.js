import React from 'react';
import { View, Modal } from 'react-native';
import style from './style';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../../constants/Colors';

const AppLoader = ({ styles }) => {
    return (
        <Modal transparent>
            <View style={style.modalBackground}>
                <View style={style.loaderContainer}>
                    <ActivityIndicator size={35} animating={true} color={Colors.bgPrimary} />
                </View>
            </View>
        </Modal>
    )
}

export default AppLoader;