import React from 'react';
import { View, Text, Pressable, Share,Alert,Linking } from 'react-native';
import style from './style';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AccountList = () => {

    const navigation = useNavigation()

    const logout=async()=>{
       
        try {
            await AsyncStorage.setItem('isLoggedIn', 'false');
            console.log('Data saved successfully!');
             navigation.navigate('Login')
          } catch (error) {
            console.log('Error saving data:', error);
          }
    }

    const callSupport=()=>{
        Linking.openURL(`tel:${3361218798}`)
        
    }

    const noop=()=>{}

    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'Deliver your goods at the best price,at the fastest time possible. Book your first service at Flat 200 Rs Off..! Visit the link to know more: www.loadgo.in',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      };
    
    const openVerificationScreen=()=>{
      navigation.navigate('Verification')
    }

    const openTermsAndCondition=()=>{
      navigation.navigate('TermsAndConditions')
    }

    const openBankDetailsScreen = ()=>{
      navigation.navigate('BankDetails')
    }

    const listItemDetails = [
        {
            id: 0,
            title: 'Verification',
            description: '',
            icon: 'verified',
            iconColor: '#fff',
            backgroundColor: '#0B6623',
            buttonText: '',
            buttonType: '',
            buttonColor: '',
            nextPage:true,
            onPress:openVerificationScreen
        },
        {
          id: 6,
          title: 'Bank Details',
          description: '',
          icon: 'bank',
          iconColor: '#fff',
          backgroundColor: '#EA906C',
          buttonText: '',
          buttonType: '',
          buttonColor: '',
          nextPage:true,
          onPress:openBankDetailsScreen
      },
        {
            id: 1,
            title: 'Invite',
            description: 'Invite Code is CRYTXH',
            icon: 'gift',
            iconColor: '#fff',
            backgroundColor: '#EBB02D',
            buttonText: 'Invite',
            buttonType: 'outlined',
            buttonColor: '',
            nextPage:false,
            onPress:onShare
        },
        {
            id: 2,
            title: 'Support',
            description: 'For queries and help',
            icon: 'message-circle',
            iconColor: '#fff',
            backgroundColor: '#57C5B6',
            buttonText: 'Call',
            buttonType: 'outlined',
            buttonColor: '#0047ab',
            nextPage:false,
            onPress:callSupport
        },
        {
            id: 3,
            title: 'Terms & Conditions',
            description: '',
            icon: 'alert-circle',
            iconColor: '#fff',
            backgroundColor: '#62CDFF',
            buttonText: '',
            buttonType: '',
            buttonColor: '',
            nextPage:true,
            onPress:openTermsAndCondition
        },
        {
        id: 4,
        title: 'Logout',
        description: '',
        icon: 'power',
        iconColor: '#fff',
        backgroundColor: '#FF6969',
        buttonText: '',
        buttonType: '',
        buttonColor: '',
        nextPage:false,
        onPress:logout
    },
    ]
    let listArr = listItemDetails.map(item => (
        <View key={item.id}>
            <Pressable android_ripple={{color: '#eee', borderless: false}} onPress={item.onPress? item.onPress : noop}>
                <View style={style.list}>
                    <View style={style.leftSection}>
                    <View style={[style.listIcon, { backgroundColor: item.backgroundColor }]} >
                        {(item.title !='Verification' && item.title !='Bank Details') && <FeatherIcon name={item.icon} color="#fff" size={21} />}
                        { item.title =='Verification' && <MatIcon name={item.icon} color="#fff" size={21} />}
                        { item.title =='Bank Details' && <FAIcon name={item.icon} color="#fff" size={16} />}
                    </View>
                    <View>
                        <Text style={style.listTitle}>{item.title}</Text>
                        {item.description && (<Text style={style.listDescription}>{item.description}</Text>)}
                    </View>
                    </View>
                    <View style={style.rightSection}>
                        {item.buttonText && (<Button style={{ borderColor: '#d6d6d6'}}  textColor='#0047ab' mode={item.buttonType} >{item.buttonText} </Button>)}
                        {item.nextPage && <FeatherIcon name='chevron-right' size={22} />}
                    </View>
                </View>
            </Pressable>
        </View>
    ))


    return (
        <View style={{ marginTop: 20 }}>
            {listArr}
        </View>
    )
}

export default AccountList;