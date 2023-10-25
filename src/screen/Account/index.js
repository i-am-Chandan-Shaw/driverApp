import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import style from './style';
import AccountList from '../../core/component/AccountList';
import { AppContext } from '../../core/helper/AppContext';
import { setDataLocally } from '../../core/helper/helper';

const Account = (props) => {
    const { globalData, setGlobalData } = useContext(AppContext)
    const [driverData, setDriverData] = useState(null)
    useEffect(() => {
        setDriverData(globalData.driverData[0])
    }, [globalData])




    return (
        <View>
            <View style={style.headerContainer}>
                <Avatar.Icon size={50} icon="account" color='#fff' style={{ backgroundColor: '#858f9e' }} />
                <View style={style.headerTextContainer}>
                    <Text numberOfLines={1} style={style.nameText}>{driverData?.driverName}</Text>
                    <View style={style.subHeaderTextContainer}>
                        <Text style={style.phoneText}>{driverData?.phone}</Text>
                        <View style={style.editContainer}>
                            {/* <FeatherIcon name='edit' size={16} color='#000' /> */}
                        </View>
                    </View>
                    {/* <Text style={style.emailText}>chandanshaw@gmail.com</Text> */}
                </View>
            </View>
            <AccountList driverData={driverData} />
        </View>
    )
}

export default Account;