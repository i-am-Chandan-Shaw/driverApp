import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import style from './style';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import imagePath from '../../constants/imagePath';



const Verification = () => {
    const Slide = ({ item, index }) => {
        let currentFront='', currentBack=''
        if(index==0){
            currentFront='aadharFront',
            currentBack='aadharBack'
        }
        if(index==1){
            currentFront='dlFront',
            currentBack='dlBack'
        }
        if(index==2){
            currentFront='rcFront',
            currentBack='rcBack'
        }
        return (
            <View style={{ marginRight: index == 2 ? 20 : 0 }}>
                <Text style={style.largeText}>{item.documentName} Details</Text>
                <View style={{ marginBottom: 10 }} />
                <View style={style.uploadCardContainer}>
                    {pic[currentFront] == '' && <View style={style.uploadCard}>
                        <FeatherIcon name="upload" size={20} color='#888' />
                        <View style={{ marginBottom: 15 }}></View>
                        <Text style={style.mediumText}>Front side of your {item.documentName}</Text>
                        <View style={{ marginBottom: 5 }}></View>
                        <Text style={style.smallText}>Upload the front side of your {item.documentName}</Text>
                        <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                        <View style={{ marginBottom: 15 }}></View>
                        <Button buttonColor='#ccc' textColor='#999' mode="contained" onPress={() => { uploadPicOption('front') }}>Choose Image</Button>
                    </View>}
                    {pic[currentFront] != '' && <View >
                        <Pressable onPress={() => { uploadPicOption('front') }}>
                            <Image style={style.img} source={{ uri: 'data:image/jpeg;base64,' + pic[currentFront] }}
                            />

                        </Pressable>
                        <Pressable style={style.closeIcon} onPress={() => { setPic({ ...pic, aadharFront: '' }) }}>
                            <AntIcon name="closecircle" size={25} color='#fff' />
                        </Pressable>
                    </View>}
                </View>
                <View style={style.uploadCardContainer}>
                    {pic[currentBack] == '' && <View style={style.uploadCard}>
                        <FeatherIcon name="upload" size={20} color='#888' />
                        <View style={{ marginBottom: 15 }}></View>
                        <Text style={style.mediumText}>Back side of your {item.documentName}</Text>
                        <View style={{ marginBottom: 5 }}></View>
                        <Text style={style.smallText}>Upload the front side of your document</Text>
                        <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                        <View style={{ marginBottom: 15 }}></View>
                        <Button buttonColor='#ccc' textColor='#999' mode="contained" onPress={() => { uploadPicOption('back') }}>Choose Image</Button>
                    </View>}
                    {pic[currentBack] != '' && <View >
                        <Pressable onPress={() => { uploadPicOption('back') }}>
                            <Image style={style.img} source={{ uri: 'data:image/jpeg;base64,' + pic[currentBack] }}
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
    ];


    const bottomSheetRef = useRef(null)
    const flatListRef = useRef();
    const snapPoints = [155];

    const uploadPicOption = (side) => {
        selectSide(side)
        bottomSheetRef.current?.present();
    }

    const [currIndex, setCurrIndex] = useState(0);
    const [currentSide, selectSide] = useState();
    const [isSubmitted, setIsSubmitted]= useState(false);



    const chooseImage = (type) => {

        let options = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: true
        }

        bottomSheetRef.current?.close();

        if (type == 'camera') {
            launchCamera(options, response => {
                if (!response.didCancel) {
                    if (currentSide == 'front') {
                        let docType = ''
                        if (currIndex == 0) {
                            docType = 'aadharFront'
                        } else if (currIndex == 1) {
                            docType = 'dlFront'
                        } else {
                            docType = 'rcFront'
                        }
                        setPic({
                            ...pic,
                            [docType]: response.assets[0].base64
                        })
                    } else {
                        let docType = ''
                        if (currIndex == 0) {
                            docType = 'aadharBack'
                        } else if (currIndex == 1) {
                            docType = 'dlBack'
                        } else {
                            docType = 'rcBack'
                        }
                        setPic({
                            ...pic,
                            [docType]: response.assets[0].base64
                        })

                    }
                }

            })
        } else {
            launchImageLibrary(options, response =>  {
                if (!response.didCancel) {
                    if (currentSide == 'front') {
                        let docType = ''
                        if (currIndex == 0) {
                            docType = 'aadharFront'
                        } else if (currIndex == 1) {
                            docType = 'dlFront'
                        } else {
                            docType = 'rcFront'
                        }
                        console.log(response.assets[0].base64);
                        setPic({
                            ...pic,
                            [docType]: response.assets[0].base64
                        })
                    } else {
                        let docType = ''
                        if (currIndex == 0) {
                            docType = 'aadharBack'
                        } else if (currIndex == 1) {
                            docType = 'dlBack'
                        } else {
                            docType = 'rcBack'
                        }
                        setPic({
                            ...pic,
                            [docType]: response.assets[0].base64
                        })

                    }
                }

            })
        }

        bottomSheetRef.current?.close();
    }

    const showImgErrorAlert=()=>{
        Alert.alert(
            'Alert',
            'Please upload both side of the image !',
            [
              { text: 'OK'},
            ],
            { 
              // Specify the custom style for the alert container
              containerStyle: style.alertContainer,
              // Specify the custom style for the alert text
              textStyle: style.alertText,
            }
          );
    }

    const submitDocuments=()=>{
        setIsSubmitted(true)
    }

    const goNext = () => {
        if(currIndex==0 && ( pic.aadharFront=='' || pic.aadharBack=='')){
            showImgErrorAlert();
            return;
        }else if (currIndex==1 && (pic.dlFront=='' || pic.dlBack=='')){
            showImgErrorAlert();
            return;
        }else if (currIndex==2 && (pic.rcFront=='' || pic.rcBack=='')){
            showImgErrorAlert();
            return;
        }
        setCurrIndex((i) => {
            flatListRef.current.scrollToIndex({ index: i + 1 })
            return i + 1
        }
        )

    }

    const goBack = () => {
        setCurrIndex((i) => {
            flatListRef.current.scrollToIndex({ index: i - 1 })
            return i - 1
        }
        )
    }


    const [pic, setPic] = useState({
        aadharFront: '',
        aadharBack: '',
        dlFront:'',
        dlBack:'',
        rcFront:'',
        rcBack:''
    })

    useEffect(()=>{
        console.log(pic)
    },[pic])


    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                {!isSubmitted && <View style={style.docContainer}>
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
                        {currIndex == 2 && <Button onPress={submitDocuments} buttonColor='green' style={{ marginTop: 20, alignSelf: 'flex-start' }} mode="contained">Submit</Button>}
                        {currIndex < 2 && <Button style={{ marginTop: 20, alignSelf: 'flex-start' }} mode="contained" onPress={goNext}>Next</Button>}
                    </View>

                </View>}
                {isSubmitted && <View style={style.submitContainer}>
                    <Image style={{height:200, width:300}} source={imagePath.docReview} />
                    <Text style={[style.headerText, {textAlign:'center'}]}>
                        Your document is under review
                    </Text>
                    <Text style={[style.subHeaderText, {textAlign:'center'}]}>
                    Your profile has been submitted & will be reviewed by our team. You will be notified if any extra information is needed.
                    </Text>
                </View>}
                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    enablePanDownToClose={true}
                    backgroundStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#d6d6d6', elevation: 20 }}
                    snapPoints={snapPoints}>
                    <View style={style.bottomSheetPopup}>
                        <Pressable style={style.cameraOption} onPress={() => { chooseImage('file') }}>
                            <MatComIcon name="file" color='#000' size={23} />
                            <View style={{ marginRight: 5 }} />
                            <Text style={{ fontSize: 16, color: '#000' }}>Upload a file</Text>
                        </Pressable>
                        <Pressable style={style.cameraOption} onPress={() => { chooseImage('camera') }}>
                            <MatComIcon name="camera" color='#000' size={23} />
                            <View style={{ marginRight: 5 }} />
                            <Text style={{ fontSize: 16, color: '#000' }}>Open Camera</Text>
                        </Pressable>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    )
}

export default Verification;