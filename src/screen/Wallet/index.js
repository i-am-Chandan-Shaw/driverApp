import React from 'react';
import { View, Text, Pressable } from 'react-native';
import style from './style';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';


const Wallet = () => {

    const transactionData=[
        {
            id:0,
            transactionId:'FAXTS1555ASJSAHH70300',
            transactionName:'Money Transfer Credited',
            amount:987,
            iconName:'call-made',
            color:'green',
            reason:''
        },
        {
            id:1,
            transactionId:'D5J7F0V60RV7B7F5GB6',
            transactionName:'Rejected Penalty',
            amount:-40,
            iconName:'call-received',
            color:'red',
            reason:''
        },
        {
            id:2,
            transactionId:'8DHS85D4A677B4C7V4C6D5',
            transactionName:'Money Transfer Penalty',
            amount:280,
            iconName:'call-made',
            color:'red',
            reason:''
        },
        {
            id:3,
            transactionId:'B0D76D9D6C45S4S5D7V8B8B',
            transactionName:'Money Transfer Credited',
            amount:1229,
            iconName:'call-received',
            color:'green',
            reason:''
        },
        {
            id:5,
            transactionId:'FAXTS1555ASJSAHH70300',
            transactionName:'Money Transfer Credited',
            amount:987,
            iconName:'call-made',
            color:'green',
            reason:''
        },
        {
            id:6,
            transactionId:'D5J7F0V60RV7B7F5GB6',
            transactionName:'Rejected Penalty',
            amount:-40,
            iconName:'call-received',
            color:'red',
            reason:''
        },
        {
            id:7,
            transactionId:'8DHS85D4A677B4C7V4C6D5',
            transactionName:'Money Transfer Penalty',
            amount:280,
            iconName:'call-made',
            color:'red',
            reason:''
        },
        {
            id:8,
            transactionId:'B0D76D9D6C45S4S5D7V8B8B',
            transactionName:'Money Transfer Credited',
            amount:1229,
            iconName:'call-received',
            color:'green',
            reason:''
        },
        
    ]
    

    let transactionArr = transactionData.map(item => (
        <View key={item.id}>
            <View style={style.transactionContainer}>
                    <View style={style.rowCenter}>
                        <MCIcon name={item.iconName} color={item.color} size={20} />
                        <View style={{marginLeft:10}}>
                            <Text numberOfLines={1} style={[style.smallText]}>{item.transactionName}</Text>
                            <View style={{marginTop:5}}></View>
                            <Text style={[style.xSmallText, { color: '#444' }]}>Transaction ID: {item.transactionId}</Text>
                        </View>
                    </View>
                    <View style={style.rowCenter}>
                        <Text style={[style.smallText, {fontSize:16}]}>₹ {item.amount}</Text>
                        <View sty={{marginLeft:15}}></View>
                        <FeatherIcon name='chevron-right' color='#000' size={22} />
                    </View>
                </View>
        </View>
    ))


    return (
        <View>
            <View style={style.balanceContainer}>
                <Text style={[style.headerText, { color: '#228b22' }]}>₹ 478</Text>
                <View style={{ marginTop: 5 }}></View>
                <Text style={[style.mediumText, { color: '#444' }]}>Wallet Balance</Text>
            </View>
            <View style={style.subheaderContainer}>
                <Pressable style={style.columnCenter}>
                    <View style={style.imageContainer}>
                        <MCIcon name='bank-transfer' color="#fff" size={30} />
                    </View>
                    <View style={{ marginTop: 5 }}></View>
                    <Text>Transfer</Text>
                </Pressable>
                <Pressable style={style.columnCenter}>
                    <View style={style.imageContainer}>
                        <FeatherIcon name='phone-call' color='#fff' size={20} />
                    </View>
                    <View style={{ marginTop: 5 }}></View>
                    <Text>Support</Text>
                </Pressable>
                <Pressable style={style.columnCenter}>
                    <View style={style.imageContainer}>
                        <MCIcon name='history' color="#fff" size={26} />
                    </View>
                    <View style={{ marginTop: 5 }}></View>
                    <Text>History</Text>
                </Pressable>


            </View>
            
            <View style={style.bottomContainer} >
                <Text style={[style.subHeaderText, { color: '#111' }]}>Transactions: </Text>
                <ScrollView style={style.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}> 
                    {transactionArr}
                </ScrollView>
            </View>
        </View>
    )
}

export default Wallet;