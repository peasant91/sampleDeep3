import React, { useEffect, useReducer, useState, useRef } from 'react'
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import NavBar from '../../components/atoms/NavBar'
import CustomInput, { PickerInput } from '../../components/atoms/CustomInput'

import IconGallery from '../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../assets/images/ic_camera_picker.svg';
import IconDelete from '../../assets/images/ic_trash_black.svg';

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

const StickerType = [
  {
    id: 0,
    name: translate('full_body')
  },
  {
    id: 1,
    name: translate('not_full_body')
  },

]


const RegisterVehicleScreen = ({ navigation, route }) => {

  const [provinceData, setprovinceData] = useState([])
  const [cityData, setcityData] = useState([])
  const [districtData, setdistrictData] = useState([])
  const [villageData, setvillageData] = useState([])

  const [images, setimages] = useState([' ', ' ', ' ', ' '])
  const [selectedPickerIndex, setselectedPickerIndex] = useState(0)
  const [imagePickerId, setimagePickerId] = useState(99)


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

  const [formStateAddress, dispatchAddress] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  })

  const doRegisterVehicle = () => {
    goToRegisterVehicleSuccess()
  }

  const goToRegisterVehicleSuccess = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'RegisterVehicleSuccess'}],
    });
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


  const openCameraPicker = async () => {
    const result = await launchCamera({
      quality: 0.5,
      includeBase64: true,
      mediaType: 'photo',
    });
    if (result) {
      setImage(result)
    }

  };

  const openGalleryPicker = async () => {
    const result = await launchImageLibrary({
      quality: 0.5,
      includeBase64: true,
      mediaType: 'photo',
    });
    if (result) {
      setImage(result)
    }
  };

  const setImage = (result) => {
    const image = images
    const base64 = `data:image/png;base64,${result.assets[0].base64}`
    image[selectedPickerIndex] = base64
    setimages([...image])
  }


  const openPicker = (id, title, data) => {
    var selectedId;
    if (id == 'driver_company_id') {
      selectedId = formState.inputValues.detail[id];
    } else if (id == 'bank') {
      selectedId = formState.inputValues.detail.bank[id];
    } else {
      selectedId = formState.inputValues[id];
    }
    console.log(selectedId);
    navigation.navigate('Picker', {
      pickerId: id,
      title: title,
      data: data,
      selectedId: selectedId,
      previousRoute: 'RegisterVehicle'
    });
  };

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_PROVINCE).then(province => {
      setprovinceData(JSON.parse(province))
    })
  }, [])

  useEffect(() => {
    pickerSheet.current.close();
    setTimeout(() => {
      if (imagePickerId == 0) {
        openCameraPicker();
      } else if (imagePickerId == 1) {
        openGalleryPicker();
      }

      setimagePickerId(99);
    }, 100);
  }, [imagePickerId]);

  //reset if parent changed
  useEffect(() => {
    dispatchAddress({
      type: 'picker',
      id: 'city_id',
      input: null,
      desc: null,
      isValid: false,
    });
  }, [cityData]);

  useEffect(() => {
    dispatchAddress({
      type: 'picker',
      id: 'district_id',
      input: null,
      desc: null,
      isValid: false,
    });
  }, [cityData, districtData]);

  useEffect(() => {
    dispatchAddress({
      type: 'picker',
      id: 'village_id',
      input: null,
      desc: null,
      isValid: false,
    });
  }, [cityData, districtData, villageData]);

  useEffect(() => {
    console.log(route.params);

    if (route.params?.pickerId) {
      const id = route.params.pickerId;
      const data = 
          {
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
        };
      if (id == 'driver_company_id') {
        dispatchDetail(data)
        //make bank null if company is picked
        dispatchDetail({
          type: 'input',
          id: 'bank',
          input: null,
          isValid: true,
        });
      } else if (id == 'bank_id') {
        dispatchBank(data);
      } else {
        dispatchAddress(data);
        if (id == 'province_id') {
          getCity(route.params.id).then(cityData => {
            setcityData(cityData);
          });
        } else if (id == 'city_id') {
          getDistrict(route.params.id).then(districtData => {
            setdistrictData(districtData);
          });
        } else if (id == 'district_id') {
          getVillage(route.params.id).then(villageData => {
            setvillageData(villageData);
          });
        }
      }
    }
  }, [route.params]);



  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <NavBar title={translate('register_vehicle')} navigation={navigation} />
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ paddingBottom: 16 }}>
        <PickerInput
          title={translate('vehicle_owner_title')}
          placeholder={translate('vehicle_owner_placeholder')}
          onPress={() => openPicker('id')}
          required
        />
        <PickerInput
          title={translate('vehicle_usage_title')}
          placeholder={translate('vehicle_usage_placeholder')}
          containerStyle={{ marginVertical: 16 }}
          required
        />
        <PickerInput
          id={'province_id'}
          title={translate('province_title')}
          placeholder={translate('province_placeholder')}
          value={formStateAddress.inputValues.province_id_value}
          required
          isCheck={formState.isChecked}
          onPress={() =>
            openPicker('province_id', 'province_title', provinceData)
          }
        />
        <PickerInput
          id={'city_id'}
          title={translate('city_title')}
          containerStyle={{ paddingVertical: 16 }}
          placeholder={translate('city_placeholder')}
          value={formStateAddress.inputValues.city_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() => openPicker('city_id', 'city_title', cityData)}
        />

        <PickerInput
          id={'district_id'}
          title={translate('district_title')}
          placeholder={translate('district_placeholder')}
          value={formStateAddress.inputValues.district_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() =>
            openPicker('district_id', 'district_title', districtData)
          }
        />

        <PickerInput
          id={'village_id'}
          title={translate('village_title')}
          containerStyle={{ paddingVertical: 16 }}
          placeholder={translate('village_placeholder')}
          value={formStateAddress.inputValues.village_id_value}
          isCheck={formState.isChecked}
          required
          onPress={() =>
            openPicker('village_id', 'village_title', villageData)
          }
        />

        <PickerInput
          title={translate('vehicle_type_title')}
          placeholder={translate('vehicle_type_placeholder')}
          required
        />
        <PickerInput
          title={translate('brand_title')}
          placeholder={translate('brand_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          required
        />
        <PickerInput
          title={translate('model_title')}
          placeholder={translate('model_placeholder')}
          required
        />
        <PickerInput
          title={translate('car_year_title')}
          placeholder={translate('car_year_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          required
        />
        <PickerInput
          title={translate('car_color_title')}
          placeholder={translate('car_color_placeholder')}
          required
        />
        <PickerInput
          title={translate('car_plate_title')}
          placeholder={translate('car_plate_placeholder')}
          containerStyle={{ paddingVertical: 16 }}
          required
        />
        <PickerInput
          id={'sticker_area_id'}
          title={translate('sticker_area_title')}
          placeholder={translate('sticker_area_placeholder')}
          value={formState.inputValues.sticker_area_id_name}
          dispatcher={dispatch}
          onPress={() => openPicker('sticker_area_id', 'sticker_area_title', StickerType)}
          required
        />

        <View style={{ marginTop: 16 }}>
          <LatoBold>{translate('desired_sticker_area')}</LatoBold>

          <StickerAreaCheckbox
            id={'back_window'}
            title={translate('back_window')}
            isChecked={formState.inputValues.back_window}
            dispatch={dispatch}
          />

          <StickerAreaCheckbox
            id={'back_luggage'}
            title={translate('back_luggage')}
            isChecked={formState.inputValues.back_luggage}
            dispatch={dispatch}
          />

          <StickerAreaCheckbox
            id={'half_body'}
            title={translate('half_body')}
            isChecked={formState.inputValues.half_body}
            dispatch={dispatch}
          />

          <StickerAreaCheckbox
            id={'all_window'}
            title={translate('all_window')}
            isChecked={formState.inputValues.all_window}
            dispatch={dispatch}
          />

        </View>

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

        <CustomInput
          title={translate('operational_time_title')}
          placeholder={translate('operational_time_placeholder')}
          dispatcher={dispatch}
          required
          />

          <PickerInput
            title={translate('is_convoy_title')}
            placeholder={translate('yes_no_placeholder')}
            containerStyle={{paddingVertical: 16}}
            required
          />

          <PickerInput
            title={translate('is_convoy_title')}
            placeholder={translate('yes_no_placeholder')}
            required
          />
          <PickerInput
            title={translate('is_broadcast_promotion_title')}
            placeholder={translate('yes_no_placeholder')}
            containerStyle={{paddingVertical: 16}}
            required
          />

          <CustomButton types={'primary'} title={translate('save')} containerStyle={{paddingVertical: 16}} onPress={doRegisterVehicle}/>
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