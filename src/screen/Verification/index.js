import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import style from './style';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';



const Verification = () => {
    const Slide = ({ item, index }) => {
        return (
            <View style={{ marginRight: index == 2 ? 20 : 0 }}>
                <Text style={style.largeText}>{item.documentName} Details</Text>
                <View style={{ marginBottom: 10 }} />
                <View style={style.uploadCardContainer}>
                    {pic.aadharFront == '' && <View style={style.uploadCard}>
                        <FeatherIcon name="upload" size={20} color='#888' />
                        <View style={{ marginBottom: 15 }}></View>
                        <Text style={style.mediumText}>Front side of your {item.documentName}</Text>
                        <View style={{ marginBottom: 5 }}></View>
                        <Text style={style.smallText}>Upload the front side of your {item.documentName}</Text>
                        <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                        <View style={{ marginBottom: 15 }}></View>
                        <Button buttonColor='#ccc' textColor='#999' mode="contained" onPress={() => { chooseImage('front') }}>Choose Image</Button>
                    </View>}
                    {pic.aadharFront != '' && <View >
                        <Pressable onPress={() => { chooseImage('front') }}>
                            <Image style={style.img} source={{ uri: 'data:image/jpeg;base64,' + pic.aadharFront }}
                            />

                        </Pressable>
                        <Pressable style={style.closeIcon} onPress={() => { setPic({ ...pic, aadharFront: '' }) }}>
                            <AntIcon name="closecircle" size={25} color='#fff' />
                        </Pressable>
                    </View>}
                </View>
                <View style={style.uploadCardContainer}>
                    {pic.aadharBack == '' && <View style={style.uploadCard}>
                        <FeatherIcon name="upload" size={20} color='#888' />
                        <View style={{ marginBottom: 15 }}></View>
                        <Text style={style.mediumText}>Back side of your {item.documentName}</Text>
                        <View style={{ marginBottom: 5 }}></View>
                        <Text style={style.smallText}>Upload the front side of your document</Text>
                        <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                        <View style={{ marginBottom: 15 }}></View>
                        <Button buttonColor='#ccc' textColor='#999' mode="contained" onPress={() => { chooseImage('back') }}>Choose Image</Button>
                    </View>}
                    {pic.aadharBack != '' && <View >
                        <Pressable onPress={() => { chooseImage('back') }}>
                            <Image style={style.img} source={{ uri: 'data:image/jpeg;base64,' + pic.aadharBack }}
                            />
                        </Pressable>
                        <Pressable style={style.closeIcon} onPress={() => { setPic({ ...pic, aadharBack: '' }) }}>
                            <AntIcon name="closecircle" size={25} color='#fff' />
                        </Pressable>
                    </View>}
                </View>
            </View>
        )
    }
    const slideList = [
        {
            id: 0,
            documentName: 'Aadhar Card'
        },
        {
            id: 1,
            documentName: 'Driving License'
        },
        {
            id: 2,
            documentName: 'Registration Certificate'
        },
    ]

    const bottomSheetRef = useRef(null)
    const flatListRef = useRef();
    const snapPoints = [175];

    const uploadPicOption=()=>{
        bottomSheetRef.current?.present();
    }

    const [currIndex, setCurrIndex] = useState(0)

    const chooseImage = (type) => {

        let options = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: true
        }

        launchCamera(options, response => {
            console.log(response);
            if (!response.didCancel) {
                if (type == 'front') {
                    setPic({
                        ...pic,
                        aadharFront: response.assets[0].base64
                    })
                } else {
                    setPic({
                        ...pic,
                        aadharBack: response.assets[0].base64
                    })

                }
            }

        })
    }

    const goNext = () => {
        console.log(currIndex);
        setCurrIndex((i) => {
            flatListRef.current.scrollToIndex({ index: i + 1 })
            return i + 1
        }
        )

    }

    const goBack = () => {
        console.log(currIndex);
        setCurrIndex((i) => {
            flatListRef.current.scrollToIndex({ index: i - 1 })
            return i - 1
        }
        )
    }


    const [pic, setPic] = useState({
        aadharFront: '',
        aadharBack: ''
    })

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <View style={style.mainContainer}>
                    <FlatList
                        ref={flatListRef}
                        pagingEnabled
                        data={slideList}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={<View style={{ marginRight: 20 }} />}
                        horizontal
                        renderItem={({ item, index }) => <Slide item={item} index={index} />}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
                        <Button disabled={currIndex == 0} style={{ marginTop: 20, alignSelf: 'flex-start' }} mode="contained" onPress={goBack}>Back</Button>
                        <View>
                            <View>

                            </View>
                        </View>
                        {currIndex == 2 && <Button buttonColor='green' style={{ marginTop: 20, alignSelf: 'flex-start' }} mode="contained">Submit</Button>}
                        {currIndex < 2 && <Button style={{ marginTop: 20, alignSelf: 'flex-start' }} mode="contained" onPress={goNext}>Next</Button>}
                    </View>

                </View>
                <BottomSheetModal
                        ref={bottomSheetRef}
                        index={0}
                        enablePanDownToClose={false}
                        backgroundStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#d6d6d6', elevation: 20 }}
                        snapPoints={snapPoints}>
                        <View style={style.bottomSheetPopup}>
                            <Text>Yoyoy</Text>
                        </View>
                    </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    )
}

export default Verification;