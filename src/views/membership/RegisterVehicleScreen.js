import React, { useEffect, useReducer, useState, useRef } from 'react'
import { BackHandler, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import NavBar from '../../components/atoms/NavBar'
import CustomInput, { PickerInput } from '../../components/atoms/CustomInput'

import IconGallery from '../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../assets/images/ic_camera_picker.svg';

import translate from '../../locales/translate'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../../constants/StorageKey'
import formReducer from '../../reducers/formReducer'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import StickerAreaCheckbox from '../../components/molecules/StickerAreaCheckbox'
import RegisterVehiclePicture from '../../components/atoms/RegisterVehiclePicture'
import CustomSheet from '../../components/atoms/CustomSheet'
import Colors from '../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import CustomButton from '../../components/atoms/CustomButton'
import { getCity, getDistrict, getVehicleBrand, getVehicleModel, getVehicleType, getVillage } from '../../services/utilities'
import { getVehicle, registerVehicle, updateVehicle } from '../../services/user'
import {dismissDialog, showDialog, useCommonAction} from '../../actions/commonActions'
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import axios from 'axios'
import { getFullLink, getImageBase64FromUrl } from '../../actions/helper'
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import {checkGalleryPermission, requestGalleryPermission} from "../../actions/permissionAction";


const RegisterVehicleScreen = ({ navigation, route }) => {
  const {showErrorDialog} = useCommonAction()
  const StickerType = [
    {
      id: 'full_body',
      name: translate('full_body')
    },
    {
      id: 'not_full_body',
      name: translate('not_full_body')
    },

  ]

  const YesNoData = [
    {
      id: 1,
      name: translate('yes'),
    },
    {
      id: 0,
      name: translate('no'),
    },
  ]

  const { isEdit, isRegister } = route.params

  const [provinceData, setprovinceData] = useState([])
  const [cityData, setcityData] = useState([])
  const [districtData, setdistrictData] = useState([])
  const [villageData, setvillageData] = useState([])
  const [isPreloading, setisPreloading] = useState(true)

  const [images, setimages] = useState([' ', ' ', ' ', ' '])
  const [selectedPickerIndex, setselectedPickerIndex] = useState(0)
  const [imagePickerId, setimagePickerId] = useState(99)

  const [ownershipData, setownershipData] = useState([])
  const [usageData, setusageData] = useState([])
  const [vehicleType, setvehicleType] = useState([])
  const [brandData, setbrandData] = useState([])
  const [modelData, setmodelData] = useState([])
  const [stickerAreaData, setstickerAreaData] = useState([])
  const [stickerArea, setstickerArea] = useState([])
  const [colorData, setcolorData] = useState([])

  // const [isRegister, setisRegister] = useState(route.params.isRegister)

  const [isLoading, setisLoading] = useState(false)
  const [isEdited, setisEdited] = useState(false)


  const pickerSheet = useRef()

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      sticker_area_id: StickerType[0].id,
      sticker_area_id_name: translate('full_body')
    },
    inputValidities: {},
    formIsValid: false,
    isChecked: false
  })

  const [formStateDetail, dispatchDetail] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  })

  const checkIsEdited = () => {
    if (isEdit && !isEdited && !isPreloading) {
      setisEdited(true)
    }
  }

  const showBackPrompt = () => {
    if (isEdited) {
      showDialog(translate('edit_confirm_desc'), true, () => dismissDialog(), () => navigation.pop(), translate('cancel_short'), translate('sure'))
      return
    }

    navigation.pop()
  }

  const goToRegisterVehicleSuccess = () => {
    navigation.navigate(isRegister ? 'RegisterVehicleSuccess' : 'RegisterVehicleSuccessMain', { isRegister: isRegister })
  }

  const doRegisterVehicle = () => {
    dispatch({
      type: 'check'
    })

    console.log(formState.formIsValid, formStateDetail.formIsValid, stickerArea.length != 0)
    if (formState.formIsValid && formStateDetail.formIsValid && images.filter(item => item != ' ').length != 0 && stickerArea.length != 0) {
      buildForm()
    }
  }

  const onDeleteImage = (index) => {
    const image = images
    image[index] = ' '
    setimages([...image])
  }

  const onAdd = (index) => {
    setselectedPickerIndex(index)
    pickerSheet.current.expand()
  }

  const buildForm = () => {
    const detail = {
      ...formStateDetail.inputValues,
      sticker_area: stickerArea.filter(item => item != null),
      images: images.filter(item => item != ' ')
    }
    const form = {
      ...formState.inputValues,
      detail: detail
    }

    setisLoading(true)

    if (!isEdit) {
      registerVehicle(form).then(response => {
        setisLoading(false)
        goToRegisterVehicleSuccess()
      }).catch(error => {
        setisLoading(false)
        showErrorDialog({
          error: error,
        })
      })
    } else {
      updateVehicle(form).then(response => {
        setisLoading(false)
        goToRegisterVehicleSuccess()
      }).catch(error => {
        setisLoading(false)
        showErrorDialog({
          error: error,
        })
      })
    }
  }

  const openCameraPicker = async () => {
    const result = await launchCamera({
      quality: 0.5,
      includeBase64: true,
      mediaType: 'photo',
    });
    setImage(result)

  };

  const openGalleryPicker = async () => {
    if (Platform.OS == 'android') {
      const permission = await checkGalleryPermission()
      console.log(permission)
      if (permission == RESULTS.BLOCKED) {
        showDialog(translate('please_allow_storage'), false, openSettings, () => navigation.pop(), translate('open_setting'), null, false)
        return
      }

      if (permission == RESULTS.DENIED) {
        const result = await requestGalleryPermission()
        console.log(result)
        if (result != RESULTS.GRANTED) {
          showDialog(translate('please_allow_storage'), false, openSettings, () => navigation.pop(), translate('open_setting'), null, false)
          return
        }
      }
    }
    const result = await launchImageLibrary({
      quality: 0.5,
      maxWidth: 1024,
      maxHeight: 768,
      includeBase64: true,
      mediaType: 'photo',
    });

    setImage(result)
  };

  const setImage = async (result) => {
    if (result == null || result == undefined || result.assets == undefined) {
      return
    }

    const image = images
    const uri = result.assets[0].uri
    const resizeImage = await ImageResizer.createResizedImage(uri, 1024, 768, 'JPEG', 30, undefined, undefined, false, {
      onlyScaleDown: true
    })
    if (resizeImage) {
      const base64String = await ImgToBase64.getBase64String(resizeImage.uri)
      image[selectedPickerIndex] = `data:image/png;base64,${base64String}`
      setimages([...image])
    }
    // const base64 = `data:image/png;base64,${result.assets[0].base64}`
    // image[selectedPickerIndex] = base64
    // setimages([...image])
  }


  const openPicker = (id, title, data, state, dispatch) => {
    const selectedId = state.inputValues[id]
    console.log(selectedId);
    navigation.navigate('Picker', {
      pickerId: id,
      title: title,
      data: data,
      selectedId: selectedId,
      previousRoute: isRegister ? 'RegisterVehicle' : 'RegisterVehicleMain',
      dispatch: dispatch,
      isRegister: isRegister,
      isEdit: isEdit
    });
  };


  //preload the form data from storage
  const preload = () => {
    AsyncStorage.getItem(StorageKey.KEY_VEHICLE_OWNERSHIP).then(response => {
      setownershipData(JSON.parse(response))
    })
    AsyncStorage.getItem(StorageKey.KEY_PROVINCE).then(province => {
      setprovinceData(JSON.parse(province))
    })
    AsyncStorage.getItem(StorageKey.KEY_VEHICLE_USAGE).then(usage => {
      setusageData(JSON.parse(usage))
    })
    AsyncStorage.getItem(StorageKey.KEY_COLOR).then(color => {
      setcolorData(JSON.parse(color))
    })
    AsyncStorage.getItem(StorageKey.KEY_VEHICLE_STICKER).then(sticker => {
      setstickerAreaData(JSON.parse(sticker).filter(item => item.value != 'full_body'))

    })
    getVehicleType().then(type => {
      setvehicleType(type)
      dispatch({
        type: 'picker',
        id: 'vehicle_type',
        input: type[0].id,
        desc: type[0].name,
        isValid: true
      })
    })

    if (isEdit) {
      getVehicle().then(response => {
        translateEditForm(response)
      }).catch(err => {
        showErrorDialog({
          error: err,
        })
      })
    }
  }

  const translateEditForm = async (form) => {
    console.log('stickerArea', form.detail.sticker_area)

    const isFullBody = form.detail.sticker_area.includes(StickerType[0].id)

    const formStateDetail = {
      inputValues: {
        color : form.detail.color,
        images: form.images,
        model_vehicle_id: form.detail.vehicle_model.id,
        model_vehicle_id_value: form.detail.vehicle_model.name,
        vehicle_brand_id: form.detail.vehicle_brand.id,
        vehicle_brand_id_value: form.detail.vehicle_brand.name,
        plate_number: form.detail.plate_number,
        sticker_area: form.detail.stickerArea,
        year: form.detail.year,
        sticker_area_id: isFullBody ? StickerType[0].id : StickerType[1].id,
        sticker_area_id_value: isFullBody ? StickerType[0].name : StickerType[1].name
      },
      inputValidities: {},
      formIsValid: true,
    }

    setstickerArea([...form.detail.sticker_area])

    const formState = {
      inputValues: {
        province_id: form.province.id,
        province_id_value: form.province.name,
        district_id: form.district.id,
        district_id_value: form.district.name,
        city_id: form.city.id,
        city_id_value: form.city.name,
        village_id: form.village?.id,
        village_id_value: form.village?.name,
        vehicle_ownership: form.vehicle_ownership.id,
        vehicle_ownership_value: form.vehicle_ownership.name,
        vehicle_usage: form.vehicle_usage.id,
        vehicle_usage_value: form.vehicle_usage.name,
        vehicle_type: form.detail.vehicle_type.id,
        vehicle_type_value: form.detail.vehicle_type.name,
        total_work_days: `${form.total_work_days}`,
        is_convoy: form.is_convoy ? 1 : 0,
        is_convoy_value: form.is_convoy ? translate('yes') : translate('false'),
        is_broadcast: form.is_broadcast ? 1 : 0,
        is_broadcast_value: form.is_broadcast ? translate('yes') : translate('false'),
        is_term: form.is_term ? 1 : 0,
        is_term_value: form.is_term ? translate('yes') : translate('false'),
      },
      inputValidities: {},
      formIsValid: true,
      isCheck: false
    }

    dispatchDetail({
      type: 'update',
      state: formStateDetail
    })

    dispatch({
      type: 'update',
      state: formState
    })

    var image = images

    for (index in form.images) {
      setisPreloading(true)
      const imageUrl = form.images[index]
      const base64 = await getImageBase64FromUrl(getFullLink(imageUrl))
      image[index] = base64
      setimages([...image])
    }

    setisPreloading(false)
    // if (!isFullBody) {
    //   setstickerArea(form.detail.sticker_area)
    // }
  }

  useEffect(() => {
    pickerSheet.current.close();
    setTimeout(() => {
      if (imagePickerId == 0) {
        openCameraPicker();
      } else if (imagePickerId == 1) {
        openGalleryPicker();
      }

      setimagePickerId(99);
    }, 500);
  }, [imagePickerId]);

  useEffect(() => {
    if (isEdit && isPreloading) {
      axios.all([
        getCity(formState.inputValues.province_id),
        getDistrict(formState.inputValues.city_id),
        getVillage(formState.inputValues.district_id)
      ]).then(axios.spread((city, district, village) => {
        setcityData(city)
        setdistrictData(district)
        setvillageData(village)
        setTimeout(() => {
          setisPreloading(false)
        }, 1500);
      }))
    }
  }, [formState])

  //reset if region changed
  useEffect(() => {
    if (!isEdit || !isPreloading) {
      dispatch({
        type: 'picker',
        id: 'city_id',
        input: null,
        desc: null,
        isValid: false,
      });
    }
  }, [cityData]);

  useEffect(() => {
    if (!isEdit || !isPreloading) {

      dispatch({
        type: 'picker',
        id: 'district_id',
        input: null,
        desc: null,
        isValid: false,
      });
    }
  }, [cityData, districtData]);

  useEffect(() => {
    if (!isEdit || !isPreloading) {
      dispatch({
        type: 'picker',
        id: 'village_id',
        input: null,
        desc: null,
        isValid: false,
      });
    }
  }, [cityData, districtData, villageData]);


  useEffect(() => {
    console.log(route.params);

    if (route.params?.pickerId) {
      const { pickerId, dispatch, id, name } = route.params;

      //set the sticker area
      if (pickerId == 'sticker_area_id') {
        //if sticker is full body set as fullbody
        //else remove the array and set according to checkbox
        if (id == StickerType[0].id) {
          setstickerArea([StickerType[0].id])
        } else {
          setstickerArea([])
        }
      }

      //build data and dispatch to specific dispatcher
      const data =
      {
        type: 'picker',
        id: pickerId,
        input: id,
        desc: name,
        isValid: true,
      };
      dispatch(data)


      //get area if parent area selected
      if (pickerId == 'province_id') {
        getCity(route.params.id).then(cityData => {
          setcityData(cityData);
        });
      } else if (pickerId == 'city_id') {
        getDistrict(route.params.id).then(districtData => {
          setdistrictData(districtData);
        });
      } else if (pickerId == 'district_id') {
        getVillage(route.params.id).then(villageData => {
          setvillageData(villageData);
        });
      }
    }

  }, [route.params]);

  useEffect(() => {
    preload()
  }, [])

  useEffect(() => {
    getVehicleBrand({
      vehicle_type_id: formState.inputValues.vehicle_type
    }).then(brand => setbrandData(brand))
  }, [formState.inputValues.vehicle_type])

  useEffect(() => {
    getVehicleModel({
      vehicle_brand_id: formStateDetail.inputValues.vehicle_brand_id
    }
    ).then(model => setmodelData(model))
  }, [formStateDetail.inputValues.vehicle_brand_id])

  useEffect(() => {
    checkIsEdited()
  }, [formState, formStateDetail])




  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <NavBar title={isEdit ? translate('edit_vehicle') : translate('register_vehicle')} navigation={navigation} onBackPress={showBackPrompt} />
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ paddingBottom: 16 }}>

        <PickerInput
          id={'vehicle_ownership'}
          title={translate('vehicle_owner_title')}
          placeholder={translate('vehicle_owner_placeholder')}
          onPress={() => openPicker('vehicle_ownership', 'vehicle_owner_title', ownershipData, formState, dispatch)}
          value={formState.inputValues.vehicle_ownership_value}
          isCheck={formState.isChecked}
          required
        />

        <PickerInput
          id={'vehicle_usage'}
          title={translate('vehicle_usage_title')}
          placeholder={translate('vehicle_usage_placeholder')}
          containerStyle={{ marginVertical: 16 }}
          onPress={() => openPicker('vehicle_usage', 'vehicle_usage_title', usageData, formState, dispatch)}
          value={formState.inputValues.vehicle_usage_value}
          isCheck={formState.isChecked}
          required
        />

        <PickerInput
          id={'province_id'}
          title={translate('province_title')}
          placeholder={translate('province_placeholder')}
          value={formState.inputValues.province_id_value}
          required
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('province_id', 'province_title', provinceData, formState, dispatch)
          }
        />
        <PickerInput
          id={'city_id'}
          title={translate('city_title')}
          containerStyle={{ paddingVertical: 16 }}
          placeholder={translate('city_placeholder')}
          value={formState.inputValues.city_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() => openPicker('city_id', 'city_title', cityData, formState, dispatch)}
        />

        <PickerInput
          id={'district_id'}
          title={translate('district_title')}
          placeholder={translate('district_placeholder')}
          value={formState.inputValues.district_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() =>
            openPicker('district_id', 'district_title', districtData, formState, dispatch)
          }
        />

        <PickerInput
          id={'village_id'}
          title={translate('village_title')}
          containerStyle={{ paddingVertical: 16 }}
          placeholder={translate('village_placeholder')}
          value={formState.inputValues.village_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() =>
            openPicker('village_id', 'village_title', villageData, formState, dispatch)
          }
        />
        {formState.inputValues.village_id == -99 && formState.inputValues.village_id_value != null &&

          <CustomInput
            id={'village_name'}
            title={translate('manual_input')}
            containerStyle={{ paddingBottom: 16 }}
            placeholder={translate('village_placeholder')}
            value={formState.inputValues.village_name}
            isCheck={formState.isChecked}
            dispatcher={dispatch}
            required
          />
        }

        <PickerInput
          id={'vehicle_type'}
          title={translate('vehicle_type_title')}
          placeholder={translate('vehicle_type_placeholder')}
          value={formState.inputValues.vehicle_type_value}
          isCheck={formState.isChecked}
          disabled={true}
          required
        />
        <PickerInput
          id={'vehicle_brand_id'}
          title={translate('brand_title')}
          placeholder={translate('brand_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          value={formStateDetail.inputValues.vehicle_brand_id_value}
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('vehicle_brand_id', 'brand_title', brandData, formStateDetail, dispatchDetail)
          }
          required
        />

        <PickerInput
          id={'model_vehicle_id'}
          title={translate('model_title')}
          placeholder={translate('model_placeholder')}
          value={formStateDetail.inputValues.model_vehicle_id_value}
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('model_vehicle_id', 'model_title', modelData, formStateDetail, dispatchDetail)
          }
          required
        />

        <CustomInput
          id={'year'}
          title={translate('car_year_title')}
          placeholder={translate('car_year_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          value={formStateDetail.inputValues.year}
          dispatcher={dispatchDetail}
          isCheck={formState.isChecked}
          keyboardType={'number-pad'}
          required
        />

        {/*<PickerInput*/}
        {/*  id={'color_id'}*/}
        {/*  title={translate('car_color_title')}*/}
        {/*  placeholder={translate('car_color_placeholder')}*/}
        {/*  value={formStateDetail.inputValues.color_id_value}*/}
        {/*  onPress={() =>*/}
        {/*    openPicker('color_id', 'car_color_title', colorData, formStateDetail, dispatchDetail)*/}
        {/*  }*/}
        {/*  isCheck={formState.isChecked}*/}
        {/*  required*/}
        {/*/>*/}

        <CustomInput
            id={'color'}
            title={translate('car_color_title')}
            placeholder={translate('car_color_placeholder')}
            containerStyle={{ paddingBottom: 16 }}
            value={formStateDetail.inputValues.color}
            dispatcher={dispatchDetail}
            isCheck={formState.isChecked}
            required
        />


        <CustomInput
          id={'plate_number'}
          title={translate('car_plate_title')}
          placeholder={translate('car_plate_placeholder')}
          containerStyle={{ paddingBottom: 16 }}
          value={formStateDetail.inputValues.plate_number}
          dispatcher={dispatchDetail}
          isCheck={formState.isChecked}
          required
        />
        <PickerInput
          id={'sticker_area_id'}
          title={translate('sticker_area_title')}
          placeholder={translate('sticker_area_placeholder')}
          value={formStateDetail.inputValues.sticker_area_id_value}
          onPress={() => openPicker('sticker_area_id', 'sticker_area_title', StickerType, formStateDetail, dispatchDetail)}
          isCheck={formState.isChecked}
          required
        />

        {formStateDetail.inputValues.sticker_area_id == StickerType[1].id &&
          <View style={{ marginTop: 16 }}>
            <LatoBold>{translate('desired_sticker_area')}</LatoBold>

            <FlatList
              data={stickerAreaData}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => {
                const isChecked = stickerArea.includes(item.value)

                return <StickerAreaCheckbox
                  title={item.name}
                  isChecked={isChecked}
                  onPress={() => {
                    if (isChecked) {
                      const index = stickerArea.indexOf(item.value)
                      if (index == 0) {
                        stickerArea.shift()
                      } else {
                        stickerArea.splice(index, 1)
                      }
                    } else {
                      stickerArea.push(item.value)
                    }
                    console.log(stickerArea)
                    setstickerArea([...stickerArea])
                  }}
                />
              }}
            />
            {formState.isChecked && stickerArea.length == 0 &&
              <LatoBold
                style={{ color: 'red', marginBottom: 10 }}>{translate('error_sticker_area')}</LatoBold>
            }


          </View>
        }

        <LatoBold style={{ color: '#012443', marginTop: 10 }}>{translate('add_vehicle_picture', { string: images.filter(item => item != ' ').length })}</LatoBold>

        <FlatList
          scrollEnabled={false}
          data={images}
          contentContainerStyle={{ paddingVertical: 10 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={{ padding: 6 }} />
          }}
          renderItem={({ item, index }) => {
            return <RegisterVehiclePicture index={index} imageUrl={item} onDelete={onDeleteImage} navigation={navigation} onAdd={onAdd} />
          }}
        />

        {formState.isChecked && images.filter(item => item != ' ').length == 0 &&
          <LatoBold
            style={{ color: 'red', marginBottom: 10 }}>{translate('error_vehicle_image')}</LatoBold>
        }


        <CustomInput
          id={'total_work_days'}
          title={translate('operational_time_title')}
          placeholder={translate('operational_time_placeholder')}
          dispatcher={dispatch}
          value={formState.inputValues.total_work_days}
          isCheck={formState.isChecked}
          keyboardType={'number-pad'}
          required
        />

        <PickerInput
          id={'is_convoy'}
          title={translate('is_convoy_title')}
          placeholder={translate('yes_no_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          value={formState.inputValues.is_convoy_value}
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('is_convoy', 'yes_no_picker', YesNoData, formState, dispatch)
          }
          required
        />

        <PickerInput
          id={'is_broadcast'}
          title={translate('is_broadcast_promotion_title')}
          placeholder={translate('yes_no_placeholder')}
          value={formState.inputValues.is_broadcast_value}
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('is_broadcast', 'yes_no_picker', YesNoData, formState, dispatch)
          }
          required
        />

        <PickerInput
          id={'is_term'}
          title={translate('is_commit_law_title')}
          placeholder={translate('yes_no_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          value={formState.inputValues.is_term_value}
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('is_term', 'yes_no_picker', YesNoData, formState, dispatch)
          }
          required
        />

        <CustomButton types={'primary'} title={translate('save')} containerStyle={{ paddingVertical: 16 }} onPress={doRegisterVehicle} isLoading={isLoading} />
      </View >
    </ScrollView>

    <CustomSheet ref={pickerSheet}>
      <View style={{ padding: 16 }}>
        <LatoBold>{translate('pick_photo')}</LatoBold>
        <TouchableOpacity
          onPress={() => setimagePickerId(1)}
          style={{ marginVertical: 10 }}>
          <LatoRegular Icon={IconGallery}>
            {translate('pick_gallery')}
          </LatoRegular>
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.divider,
            marginBottom: 10,
            marginLeft: 28,
          }}
        />
        <TouchableOpacity onPress={() => setimagePickerId(0)}>
          <LatoRegular Icon={IconCamera}>
            {translate('pick_camera')}
          </LatoRegular>
        </TouchableOpacity>
      </View>
    </CustomSheet>
  </SafeAreaView>

}

export default RegisterVehicleScreen
