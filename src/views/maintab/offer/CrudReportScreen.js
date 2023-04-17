import React, {useReducer, useEffect, useState, useRef} from 'react'
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {
    dismissDialog,
    showDialog,
    showLoadingDialog,
    showUploadDialog, useCommonAction
} from '../../../actions/commonActions'
import {getFullLink, mapReportImages, mapStickerArea} from '../../../actions/helper'
import CustomButton from '../../../components/atoms/CustomButton'
import CustomInput from '../../../components/atoms/CustomInput'
import CustomSheet from '../../../components/atoms/CustomSheet'
import {LatoBold, LatoRegular} from '../../../components/atoms/CustomText'
import NavBar from '../../../components/atoms/NavBar'
import ReportImage from '../../../components/atoms/ReportImage'
import translate from '../../../locales/translate'
import formReducer from '../../../reducers/formReducer'
import {getReportDetail, patchReportImage, postReport, postReportImage} from '../../../services/report'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import IconGallery from '../../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../../assets/images/ic_camera_picker.svg';
import IconDelete from '../../../assets/images/ic_trash_black.svg';
import Colors from '../../../constants/Colors'
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {checkGalleryPermission, requestGalleryPermission} from "../../../actions/permissionAction";
import {LinearProgress} from "react-native-elements";
import ReportImageEditBS from "../../../components/molecules/ReportImageEditBS";

const CrudReportScreen = ({navigation, route}) => {

    const {isAdd, id, stickerArea} = route.params
    const [stickerLayoutData, setStickerLayoutData] = useState([])
    const [imagePickerId, setimagePickerId] = useState(99);
    const [imageIndicator, setImageIndicator] = useState({current: 1, last: 99})
    const [imageQueue, setimageQueue] = useState([])
    const [isloading, setisloading] = useState(false)
    const reportId = useRef(0)
    const totalImageUpload = useRef(0)
    const [currentUploadTask, setCurrentUploadTask] = useState()
    const {showErrorDialog, hideErrorDialog, showLoadingDialog, hideLoadingDialog} = useCommonAction()

    const [isOpenEditBS, setIsOpenEditBS] = useState(false)
    const [selectedPicker, setSelectedPicker] = useState(undefined)

    const handleOpenEditBS = ({
                                  id,
                                  location,
                                  index,
                                  imageId,
                                  imageUri,
                                  imageTitle
                              }) => {
        setSelectedPicker({
            id,
            location,
            index,
            imageId,
            imageUri,
            imageTitle
        })
        setIsOpenEditBS(true)
    }

    const handleCloseEditBS = () => {
        setIsOpenEditBS(false)
    }


    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
            desc: '',
            odometer: ' ',
            is_new_odometer: false
        },
        inputValidities: {
            odometer: false
        },
        formIsValid: false,
        isChecked: false
    })

    const getStickers = () => {
        mapStickerArea(stickerArea).then(response => {
            setStickerLayoutData(response)
        })
    }

    const postImagesData = async () => {
        const stickerImages = []
        for (let index in stickerLayoutData) {
            const data = {
                sticker_area: stickerLayoutData[index].value,
                images: [...stickerLayoutData[index].images]
            }
            stickerImages.push(data)
        }

        for (let stickerImage of stickerImages) {
            for (let image of stickerImage.images) {
                const response = await postReportImage(reportId.current, {
                    image: image?.image,
                    sticker_area: stickerImage.sticker_area
                })
            }
        }
    }

    const patchImageData = async () => {
        const stickerImages = []
        for (let index in stickerLayoutData) {
            const data = {
                sticker_area: stickerLayoutData[index].value,
                images: [...stickerLayoutData[index].images]
            }
            stickerImages.push(data)
        }

        for (let stickerImage of stickerImages) {
            for (let image of stickerImage.images) {
                if (image?.is_new) {
                    if (image?.id) {
                        const response = await patchReportImage(reportId.current, image?.id, {
                            image: image?.image,
                            sticker_area: stickerImage.sticker_area
                        })
                    } else {
                        const response = await postReportImage(reportId.current, {
                            image: image?.image,
                            sticker_area: stickerImage.sticker_area
                        })
                    }
                }
            }
        }

    }


    const doReport = async () => {

        dispatch({
            type: 'check'
        })

        //console.log(formState)
        let imageIsValid = true

        for (let index in stickerLayoutData) {
            const item = stickerLayoutData[index]
            imageIsValid = item.images?.every(image => image?.image) ? true : false
        }

        if (formState.formIsValid && imageIsValid) {
            try {
                // showUploadDialog("Mengunggah", totalImageUpload.current, 0)
                showLoadingDialog({
                    title: "Mengunggah",
                    message: "Sedang memproses laporan..."
                })
                setisloading(true)
                const response = await postReport(reportId.current, formState.inputValues)
                if (isAdd) {
                    const postImagesRes = await postImagesData()
                } else {
                    const res = await patchImageData()
                }

                setisloading(false)
                hideLoadingDialog()

                await showErrorDialog({
                    error: {
                        title: "Berhasil",
                        message: "Laporan berhasil disimpan"
                    },
                    positiveAction: () => {
                        navigation.goBack()
                    }
                })
            } catch (e) {
                hideLoadingDialog()
                showErrorDialog({
                    error: e
                })
            }
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
                    setCurrentUploadTask(prev => prev + 1)
                    image.images.shift()
                    setimageQueue([...imageQueue])
                }).catch(err => {
                    showErrorDialog({
                        error: err
                    })
                })
            } else {
                if (imageQueue.length <= 1) {
                    setimageQueue([])
                } else {
                    imageQueue.shift()
                    setimageQueue([...imageQueue])
                }
            }
        } else {
            console.log('finish')
            showDialog(translate('report_send_success'))
        }
    }


    //detect bottomsheet state should visible the delete button or not
    // const isPickedImageEmpty = () => {
    //     if (selectedPicker) {
    //         if (selectedPicker.location == 'body') {
    //             return (
    //                 formStateCard.inputValues[selectedPicker.id] == ' ' ||
    //                 formStateCard.inputValues[selectedPicker.id] == undefined
    //             );
    //         } else {
    //             return (
    //                 formState.inputValues[selectedPicker.id] == ' ' ||
    //                 formState.inputValues[selectedPicker.id] == undefined
    //             );
    //         }
    //     } else {
    //         return false;
    //     }
    // };

    const openCameraPicker = async selected => {
        const result = await launchCamera({
            quality: 0.5,
            includeBase64: true,
            mediaType: 'photo',
        });
        processResult(result, selected)
    };

    const processResult = (result, selected) => {
        if (result == null || result == undefined || result.assets == undefined) {
            return
        }
        console.log("get data");
        if (selected.location != 'odometer') {
            const data = stickerLayoutData.filter(item => item.value == selected.id)
            const dataIndex = stickerLayoutData.findIndex(item => item.value == selected.id)
            console.log(dataIndex, data)
            if (data?.length == 1) {
                const newStickerLayoutData = [...stickerLayoutData]
                const newItem = {
                    ...newStickerLayoutData[dataIndex].images[selected.index],
                    image: 'data:image/jpg;base64,' + result.assets[0].base64,
                    is_new: true
                }
                newStickerLayoutData[dataIndex].images[selected.index] = newItem
                console.log("new sticker layout data", newStickerLayoutData[dataIndex].images[selected.index])
                setStickerLayoutData(newStickerLayoutData)
            }
        } else {
            console.log("get data odometer", result.assets[0].base64)
            dispatch({
                type: 'input',
                id: selected.id,
                input: 'data:image/jpg;base64,' + result.assets[0].base64,
                isValid: true,
            });
        }
    }

    // useEffect(() => {
    //     if (imageQueue.length > 0) {
    //         postReportImageAPI()
    //     } else {
    //         if (isloading) {
    //             showDialog(translate('report_send_success'), false, () => navigation.pop())
    //         }
    //     }
    // }, [imageQueue])


    useEffect(() => {
        if (!currentUploadTask) {
            return
        }
        console.log("current upload task", currentUploadTask)
        console.log("current total task", totalImageUpload.current)
        showUploadDialog("Mengunggah", totalImageUpload.current, currentUploadTask)
        if (currentUploadTask == totalImageUpload.current - 1) {
            dismissDialog()
        }
    }, [currentUploadTask])


    useEffect(() => {
        if (!isAdd) {
            reportId.current = id
            getReportDetail(id)
                .then(response => {
                    console.log("REPORT DETAIL", JSON.stringify(response, null, 2))
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
                        console.log("sticker layout data", JSON.stringify(data, null, 2))
                        setStickerLayoutData(data)
                    })
                }).catch(err => {
                showErrorDialog({
                    error: err
                })
            })
        } else {
            reportId.current = id
            getStickers()
        }
    }, [])


    const handlePickImage = async ({
                                       id,
                                       location,
                                       index
                                   }) => {
        await openCameraPicker({
            id,
            location,
            index
        });
    };


    return <>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <NavBar navigation={navigation} title={translate(isAdd ? 'create_report' : 'report_detail')} shadowEnabled/>
            <ScrollView style={{padding: 16, flex: 1}}>
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
                        // console.log(value)
                        return <View style={{marginBottom: 16}}>
                            <LatoBold>{translate('report_string', {body: value.name})}<LatoBold
                                style={{color: 'red'}}>*</LatoBold></LatoBold>
                            <FlatList
                                style={{zIndex: -99}}
                                scrollEnabled={false}
                                columnWrapperStyle={{justifyContent: 'space-between'}}
                                data={value.images}
                                numColumns={2}
                                renderItem={({item, index}) => {
                                    console.log("item new", item.is_new)
                                    return <ReportImage item={item} navigation={navigation} title={value.name}
                                                        onPress={() => handlePickImage({
                                                            id: value.value,
                                                            location: value.value,
                                                            index
                                                        })}
                                                        // onPressEdit={() => {
                                                        //     handleOpenEditBS({
                                                        //         id: value.value,
                                                        //         location: value.value,
                                                        //         index,
                                                        //         imageId: item.id,
                                                        //         imageUri: item.image,
                                                        //         imageTitle: value.name
                                                        //     })
                                                        // }}
                                    />
                                }}/>
                            {
                                stickerLayoutData.filter(item => item.value == value.value)[0]?.images?.includes(' ') && formState.isChecked &&
                                <LatoBold style={{color: 'red'}}
                                          containerStyle={{marginTop: 10}}>{translate('error_image', {string: value.name})}</LatoBold>
                            }
                        </View>
                    })
                }

                <LatoBold>{translate('odometer_photo')}<LatoBold style={{color: 'red'}}>*</LatoBold></LatoBold>

                <View style={{paddingBottom: 24}}>
                    <ReportImage
                        type={"odometer"}
                        item={formState.inputValues.odometer}
                        onPress={() => handlePickImage({
                            id: "odometer",
                            location: "odometer",
                        })}
                        navigation={navigation}
                        // onPressEdit={() => {
                        //     handleOpenEditBS({
                        //         id: "odometer",
                        //         location: "odometer",
                        //         imageUri: formState.inputValues.odometer,
                        //         imageTitle: "Odometer"
                        //     })
                        //
                        // }}
                        title={translate('odometer')}/>
                </View>
                {
                    !formState.inputValidities.odometer && formState.isChecked && <LatoBold style={{color: 'red'}}
                                                                                            containerStyle={{paddingBottom: 10}}>{translate('error_odometer')}</LatoBold>
                }

                {
                    isAdd ? <CustomButton types={'primary'} title={translate('save')} onPress={doReport}
                                          containerStyle={{marginBottom: 24}} isLoading={isloading}/>
                        : <></>
                }


            </ScrollView>

        </SafeAreaView>
        <ReportImageEditBS
            open={isOpenEditBS}
            onClose={handleCloseEditBS}
            onOpenPreview={() => {
                handleCloseEditBS()
                navigation.navigate('ImageViewer', {
                    imageUrl: selectedPicker.imageUri?.includes('/storage/') ? getFullLink(selectedPicker.imageUri) : item,
                    title: selectedPicker?.imageTitle
                })
            }}
            onRetakeImage={() => {
                handleCloseEditBS()
                handlePickImage({
                    id: selectedPicker.id,
                    location: selectedPicker.location,
                    index: selectedPicker.index
                })
            }}
        />
    </>

}

export default CrudReportScreen
