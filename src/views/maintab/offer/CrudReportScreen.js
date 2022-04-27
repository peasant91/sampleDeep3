import React, { useReducer, useEffect, useState } from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { showDialog } from '../../../actions/commonActions'
import { mapReportImages, mapStickerArea } from '../../../actions/helper'
import CustomButton from '../../../components/atoms/CustomButton'
import CustomInput from '../../../components/atoms/CustomInput'
import { LatoBold } from '../../../components/atoms/CustomText'
import NavBar from '../../../components/atoms/NavBar'
import ReportImage from '../../../components/atoms/ReportImage'
import translate from '../../../locales/translate'
import formReducer from '../../../reducers/formReducer'
import { getReportDetail, postReport } from '../../../services/report'

const CrudReportScreen = ({navigation, route}) => {

    const { isAdd, id, stickerArea } =  route.params
    const [stickerLayoutData, setStickerLayoutData] = useState([])
    const [selectedPicker, setselectedPicker] = useState()

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
        },
        inputValidities: {},
        formIsValid: false,
        isCheck: false
    })

    const getStickers = () => {
        mapStickerArea(stickerArea).then(response => {
            console.log('map sticker', response)
            setStickerLayoutData(response)
        })
    }

  const openImagePicker = async (id, location) => {
    pickerSheet.current.expand();
    setselectedPicker({
      id,
      location,
    });
  };

  const doReport = () => {
    postReport(formState.inputValues).then(response => {

    }).catch(err => {
        showDialog(err.message)
    })
  }

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
    
    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar navigation={navigation} title={translate(isAdd ? 'create_report' : 'report_detail')}/>
        <ScrollView style={{padding: 16}}>
            <CustomInput
            id={'desc'}
            title={translate('report_detail')}
            placeholder={translate('report_detail_placeholder')}
            dispatcher={dispatch}
            value={formState.inputValues.desc}
            disabled={!isAdd}
            />
            {
                stickerLayoutData?.map((value, index) => {
                    console.log(value)
                    return <View style={{marginVertical: 16}}>
                        <LatoBold>{translate('report_string', {body: value.name})}<LatoBold style={{color: 'red'}}>*</LatoBold></LatoBold>
                        <FlatList
                        scrollEnabled={false}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                        data={value.images}
                        numColumns={2}
                        renderItem={({item, index}) => {
                            return <ReportImage imageUri={item} navigation={navigation} title={value.name}/>
                        }}/>
                    </View>
                })
            }

            <LatoBold>{translate('odometer_photo')}<LatoBold style={{color: 'red'}}>*</LatoBold></LatoBold>
            <ReportImage imageUri={formState.inputValues.odometer} onPress={openImagePicker} navigation={navigation} title={translate('odometer')}/>
            <CustomButton types={'primary'} title={translate('save')} onPress={doReport} containerStyle={{marginVertical: 24}}/>
        </ScrollView>
    </SafeAreaView>

}

export default CrudReportScreen