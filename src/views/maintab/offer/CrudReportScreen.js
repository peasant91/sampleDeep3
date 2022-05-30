import React, { useReducer, useEffect, useState, useRef } from 'react'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { showDialog, showLoadingDialog } from '../../../actions/commonActions'
import { mapReportImages, mapStickerArea } from '../../../actions/helper'
import CustomButton from '../../../components/atoms/CustomButton'
import CustomInput from '../../../components/atoms/CustomInput'
import CustomSheet from '../../../components/atoms/CustomSheet'
import { LatoBold, LatoRegular } from '../../../components/atoms/CustomText'
import NavBar from '../../../components/atoms/NavBar'
import ReportImage from '../../../components/atoms/ReportImage'
import translate from '../../../locales/translate'
import formReducer from '../../../reducers/formReducer'
import { getReportDetail, postReport, postReportImage } from '../../../services/report'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import IconGallery from '../../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../../assets/images/ic_camera_picker.svg';
import IconDelete from '../../../assets/images/ic_trash_black.svg';
import Colors from '../../../constants/Colors'
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

const CrudReportScreen = ({ navigation, route }) => {

    const { isAdd, id, stickerArea } = route.params
    const [stickerLayoutData, setStickerLayoutData] = useState([])
    const [selectedPicker, setselectedPicker] = useState()
    const [imagePickerId, setimagePickerId] = useState(99);
    const [imageIndicator, setImageIndicator] = useState({ current: 1, last: 99 })
    const pickerSheet = useRef()
    const [imageQueue, setimageQueue] = useState([])
    const [isloading, setisloading] = useState(false)
    const reportId = useRef(0)



    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
            desc: '',
            odometer: ' '
        },
        inputValidities: {
            odometer: false
        },
        formIsValid: false,
        isChecked: false
    })

    const getStickers = () => {
        mapStickerArea(stickerArea).then(response => {
            console.log('map sticker', response)
            setStickerLayoutData(response)
        })
    }

    const makeImageQueue = () => {
        var array = []
        for (index in stickerLayoutData) {
            const data = {
                sticker_area: stickerLayoutData[index].value,
                images: [...stickerLayoutData[index].images]
            }
            array.push(data)
        }
        setimageQueue([...array])
        // showLoadingDialog(`mengeirim ${imageIndicator.current}/ ${queue.length}`)
    }

    const openImagePicker = async (id, location, index) => {
        pickerSheet.current.expand();
        setselectedPicker({
            id,
            location,
            index
        });
    };

    const doReport = () => {

        dispatch({
            type: 'check'
        })

        console.log(formState)
        let imageIsValid = true

        for(index in stickerLayoutData) {
            const item  = stickerLayoutData[index]
            imageIsValid = !item.images.includes(" ")
        }

        if (formState.formIsValid && imageIsValid) {
        setisloading(true)
        postReport(formState.inputValues).then(response => {
            reportId.current = response.report_id
            makeImageQueue()
        }).catch(err => {
            // showDialog(err.message)
        })
        }
    }

    const postReportImageAPI = () => {
        const image = imageQueue[0]
        if (image) {
            if (image.images.length > 0) {
                postReportImage(reportId.current, {
                    image: image.images[0],
                    sticker_area: image.sticker_area
                }).then(response => {
                    image.images.shift()
                    setimageQueue([...imageQueue])
                }).catch(err => {
                    showDialog(err.message)
                })
            } else {
                if (imageQueue.length <= 1) {
                    setimageQueue([])
                } else {
                    setimageQueue([...imageQueue.shift()])
                }
            }
        } else {
            console.log('finish')
            showDialog(translate('report_send_success'))
        }
    }


    //detect bottomsheet state should visible the delete button or not
    const isPickedImageEmpty = () => {
        if (selectedPicker) {
            if (selectedPicker.location == 'body') {
                return (
                    formStateCard.inputValues[selectedPicker.id] == ' ' ||
                    formStateCard.inputValues[selectedPicker.id] == undefined
                );
            } else {
                return (
                    formState.inputValues[selectedPicker.id] == ' ' ||
                    formState.inputValues[selectedPicker.id] == undefined
                );
            }
        } else {
            return false;
        }
    };

    const openCameraPicker = async selectedPicker => {
        const result = await launchCamera({
            quality: 0.5,
            includeBase64: true,
            mediaType: 'photo',
        });
        processResult(result)
    };

    const openGalleryPicker = async selectedPicker => {
    if (Platform.OS == 'android'){
      const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      console.log(permission)
      if (permission == RESULTS.BLOCKED) {
          showDialog(translate('please_allow_storage'), false, openSettings, () => navigation.pop(), translate('open_setting'), null, false)
        return
      }

      if (permission == RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        console.log(result)
        if (result != RESULTS.GRANTED) {
          showDialog(translate('please_allow_storage'), false, openSettings, () => navigation.pop(), translate('open_setting'), null, false)
        return
        }
      }
    }
        const result = await launchImageLibrary({
            quality: 0.5,
            includeBase64: true,
            mediaType: 'photo',
        });
        processResult(result)
    };

    const processResult = (result) => {
        if (result) {
            if (selectedPicker.location != 'odometer') {
                const data = stickerLayoutData.filter(item => item.value == selectedPicker.id)
                if (data.length == 1) {
                    data[0].images[selectedPicker.index] = 'data:image/jpg;base64,' + result.assets[0].base64
                    console.log('data', data)
                    setStickerLayoutData([...stickerLayoutData])
                }
            } else {
                dispatch({
                    type: 'input',
                    id: selectedPicker.id,
                    input: 'data:image/jpg;base64,' + result.assets[0].base64,
                    isValid: true,
                });
            }
        }
    }

    useEffect(() => {
        pickerSheet.current.close();
        setTimeout(() => {
            if (imagePickerId == 0) {
                openCameraPicker(selectedPicker);
            } else if (imagePickerId == 1) {
                openGalleryPicker(selectedPicker);
            } else if (imagePickerId == 2) {
                deleteImage(selectedPicker);
            }

            setimagePickerId(99);
        }, 500);
    }, [imagePickerId]);


    useEffect(() => {
        if (imageQueue.length > 0) {
            postReportImageAPI()
        } else {
            if (isloading) {
                showDialog(translate('report_send_success'), false, () => navigation.pop())
            }
        }
    }, [imageQueue])


    useEffect(() => {
        if (!isAdd) {
            getReportDetail(id)
                .then(response => {
                    dispatch({
                        type: 'update',
                        state: {
                            inputValues: {
                                desc: response.desc,
                                odometer: response.odometer
                            },
                            inputValidities: {
                                desc: true,
                                odometer: true
                            }

                        }
                    })

                    mapReportImages(response.report_images).then(data => {
                        setStickerLayoutData(data)
                    })
                }).catch(err => {
                    showDialog(err.message)
                })
        } else {
            getStickers()
        }
    }, [])

    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar navigation={navigation} title={translate(isAdd ? 'create_report' : 'report_detail')} shadowEnabled />
        <ScrollView style={{ padding: 16, flex: 1 }}>
            <CustomInput
                id={'desc'}
                title={translate('report_detail')}
                placeholder={translate('report_detail_placeholder')}
                dispatcher={dispatch}
                value={formState.inputValues.desc}
                containerStyle={{paddingBottom: 16}}
                disabled={!isAdd}
                required
                isCheck={formState.isChecked}
            />
            {
                stickerLayoutData?.map((value, index) => {
                    console.log(value)
                    return <View style={{ marginBottom: 16 }}>
                        <LatoBold>{translate('report_string', { body: value.name })}<LatoBold style={{ color: 'red' }}>*</LatoBold></LatoBold>
                        <FlatList
                            style={{zIndex: -99}}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            data={value.images}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                                return <ReportImage imageUri={item} navigation={navigation} title={value.name} onPress={() => openImagePicker(value.value, value.value, index)} />
                            }} />
            {
                 stickerLayoutData.filter(item =>  item.value == value.value)[0]?.images?.includes(' ') && formState.isChecked && <LatoBold style={{color: 'red'}} containerStyle={{marginTop: 10}}>{translate('error_image', {string: value.name})}</LatoBold>
            }
                    </View>
                })
            }

            <LatoBold>{translate('odometer_photo')}<LatoBold style={{ color: 'red' }}>*</LatoBold></LatoBold>

            <View style={{paddingBottom: 24}}>

            <ReportImage 
                imageUri={formState.inputValues.odometer} 
                onPress={() => openImagePicker('odometer', 'odometer')} 
                navigation={navigation} 
                title={translate('odometer')} />

            </View>
            {
                !formState.inputValidities.odometer && formState.isChecked && <LatoBold style={{color: 'red'}} containerStyle={{marginTop: 10}}>{translate('error_odometer')}</LatoBold>
            }

            {
                isAdd && <CustomButton types={'primary'} title={translate('save')} onPress={doReport} containerStyle={{ marginBottom: 24 }} isLoading={isloading} />
            }



        </ScrollView>

        <CustomSheet ref={pickerSheet}>
            <View style={{ padding: 16 }}>
                <LatoBold style={{marginBottom: 10}}>{translate('pick_photo')}</LatoBold>
                <TouchableOpacity onPress={() => setimagePickerId(0)}>
                    <LatoRegular Icon={IconCamera}>
                        {translate('pick_camera')}
                    </LatoRegular>
                </TouchableOpacity>
                {!isPickedImageEmpty() && (
                    <View>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: Colors.divider,
                                marginTop: 10,
                                marginBottom: 10,
                                marginLeft: 28,
                            }}
                        />
                        <TouchableOpacity onPress={() => setimagePickerId(2)}>
                            <LatoRegular Icon={IconDelete}>
                                {translate('pick_delete')}
                            </LatoRegular>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </CustomSheet>
    </SafeAreaView>

}

export default CrudReportScreen