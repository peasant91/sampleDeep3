import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import CustomText, {
  LatoBold,
  LatoRegular,
} from '../../components/atoms/CustomText';
import translate from '../../locales/translate';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput, {
  PhoneInput,
  PickerInput,
  PasswordInput,
} from '../../components/atoms/CustomInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import formReducer from '../../reducers/formReducer.js';
import {showDialog, dismissDialog} from '../../actions/commonActions';
import {register, updateProfile} from '../../services/auth';
import NavBar from '../../components/atoms/NavBar';
import {Image} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import CustomSheet from '../../components/atoms/CustomSheet';

import IconProfilePlaceholder from '../../assets/images/ic_profile_placeholder.svg';
import IconProfileAddImage from '../../assets/images/ic_profile_add_image.svg';
import IconGallery from '../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../assets/images/ic_camera_picker.svg';
import IconDelete from '../../assets/images/ic_trash_black.svg';

import GenderComponents from '../../components/molecules/GenderComponents';
import IDCard from '../../components/atoms/IDCard';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import {getCity, getDistrict, getProvince, getVillage} from '../../services/utilities';
import moment from 'moment';
import Colors from '../../constants/Colors';
import Config from '../../constants/Config';
import { getFullLink } from '../../actions/helper';
import { getUserBank } from '../../services/user';

const dummyDivision = [
  {
    id: 1,
    title: 'Marketing',
  },
  {
    id: 2,
    title: 'Marketing',
  },
  {
    id: 3,
    title: 'Marketing',
  },
];

const RegisterScreen = ({navigation, route}) => {

  const [companyData, setcompanyData] = useState();
  const [provinceData, setprovinceData] = useState();
  const [cityData, setcityData] = useState();
  const [districtData, setdistrictData] = useState();
  const [villageData, setvillageData] = useState();
  const [bankData, setbankData] = useState();
  const [selectedPicker, setselectedPicker] = useState();
  const [imagePickerId, setimagePickerId] = useState(99);
  const [preloading, setpreloading] = useState(true)

  const [isLoading, setIsLoading] = useState(false);
  const [openDate, setopenDate] = useState(false);

  const { isEdit, data} = route.params

  const pickerSheet = useRef();

  const [formStateBank, dispatchBank] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: isEdit,
  });

  const [formStateAddress, dispatchAddress] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: isEdit,
  });

  const [formStateCard, dispatchCard] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: isEdit,
  });

  const [formStateDetail, dispatchDetail] = useReducer(formReducer, {
    inputValues: {
      gender: '',
    },
    inputValidities: {
      gender: isEdit,
    },
    formIsValid: isEdit,
  });

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
    },
    inputValidities: {},
    formIsValid: isEdit, 
    isChecked: false,
  });

  

  const doRegister = () => {
    dispatch({
      type: 'check',
    });

    console.log(formState.formIsValid ,formStateCard.formIsValid , formStateDetail.formIsValid , formStateAddress.formIsValid ,formStateBank.formIsValid);

    if (formState.formIsValid && formStateCard.formIsValid && formStateDetail.formIsValid && formStateAddress.formIsValid && (formStateBank.formIsValid || formStateDetail.inputValues.driver_company_id != null)) {
      // setIsLoading(true);
      // register(formState.inputValues)
      //   .then(response => {
      //     setIsLoading(false);
      //     goToSuccess();
      //   })
      //   .catch(err => {
      //     setIsLoading(false);
      //     showDialog(err.message, false);
      //   });

      buildForm(formState)
    }
  };

  //translate form into input state if edit profile
  const translateForm = () => {
    console.log(data.city.id)
    const state = {
      inputValues:
    {
      name: data.name,
      email: data.email,
      phone1: data.phone1,
      phone2: data.phone2,
    },
    formIsValid: true 
    }

    const stateDetail = {
      inputValues: {
        birth_date: data.birth_date,
        driver_company_id: data.driver_company.id,
        driver_company_id_value: data.driver_company.name,
        profile_image_uri: data.profile_image,
        gender: data.gender
      },
      formIsValid: true
    }

    const stateAddress = {
      inputValues: {
        address: data.address,
        postal_code: data.postal_code,
        province_id: data.province.id,
        province_id_value: data.province.name,
        city_id: data.city.id,
        city_id_value: data.city.name,
        district_id: data.district.id,
        district_id_value: data.district.name,
        village_id: data.village.id,
        village_id_value: data.village.name
      },
      formIsValid: true
    }

    const stateCard = {
      inputValues: {
        ktp: data.ktp.number,
        ktp_image_uri: data.ktp.image,
        sim_a: data.sim_a.number,
        sim_a_image_uri: data.sim_a.image
      },
      formIsValid: true
    }

    // console.log('card', stateCard)
    // console.log('address', stateAddress)



    dispatchDetail({
      type: 'update',
      state: stateDetail
    })

    dispatchAddress({
      type: 'update',
      state: stateAddress
    })

    dispatchCard({
      type: 'update',
      state: stateCard
    })

    dispatch({
      type: 'update',
      state: state
    })

    onPickDate(data.birth_date)
  }


  const buildForm = (formState) => {
    var card = []
    for (item in Config.cardList) {
      if (formStateCard.inputValues[Config.cardList[item]]) {
        // console.log('push', Config.cardList[item])
      card.push({
        type: Config.cardList[item],
        number: formStateCard.inputValues[Config.cardList[item]],
        image: formStateCard.inputValues[`${Config.cardList[item]}_image`]
      })
      }
    }

    const detail = {
      ...formStateDetail.inputValues,
      bank: formStateDetail.inputValues.driver_company_id ? null : formStateBank.inputValues,
      address: formStateAddress.inputValues,
      card: card
    }

    const data = {
      ...formState.inputValues,
      detail: detail
    }

    if (isEdit) {
      setIsLoading(true)
      updateProfile(data).then(() => {
        setIsLoading(false)
        navigation.navigate('Account', { isChangeProfile: true} , true)
      })
    } else {
      navigation.navigate('RegisterPassword', {data: data});
    }
  }

  const onGenderPicked = value => {
    dispatchDetail({
      id: 'gender',
      type: 'input',
      input: value,
      isValid: true,
    });
  };

  const onPickDate = date => {
    console.log(moment(date).format('YYYY-MM-DD'));
    setopenDate(false);
    dispatchDetail({
      type: 'picker',
      id: 'birth_date',
      input: moment(date).format('YYYY-MM-DD'),
      desc: moment(date).format('DD MMMM YYYY'),
      isValid: true,
    });
  };

  useEffect(() => {
    pickerSheet.current.close();
    setTimeout(() => {
      if (imagePickerId == 0) {
        openCameraPicker(selectedPicker);
      } else if (imagePickerId == 1) {
        openGalleryPicker(selectedPicker);
      } else if (imagePickerId == 2){
        deleteImage(selectedPicker);
      }

      setimagePickerId(99);
    }, 100);
  }, [imagePickerId]);

  const deleteImage = selectedPicker => {
      if (selectedPicker.location == 'card') {
        dispatchCard({
          type: 'input',
          id: selectedPicker.id,
          input: undefined,
          isValid: false,
        });
        dispatchCard({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: undefined,
          isValid: false,
        });
      } else {
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id,
          input: undefined,
          isValid: false,
        });
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: undefined,
          isValid: false,
        });
  }
}

  const openCameraPicker = async selectedPicker => {
    const result = await launchCamera({
      quality: 0.5,
      includeBase64: true,
      mediaType: 'photo',
    });
    if (result) {
      if (selectedPicker.location == 'card') {
        dispatchCard({
          type: 'input',
          id: selectedPicker.id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchCard({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
      } else {
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
      }
    }

    // console.log(result);
    // console.log(formStateBank);
  };

  const openGalleryPicker = async selectedPicker => {
    const result = await launchImageLibrary({
      quality: 0.5,
      includeBase64: true,
      mediaType: 'photo',
    });
    if (result) {
      if (selectedPicker.location == 'card') {
        dispatchCard({
          type: 'input',
          id: selectedPicker.id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchCard({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
      } else {
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchDetail({
          type: 'input',
          id: selectedPicker.id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
      }
    }

    // console.log(result);
    // console.log(formStateBank);
  };

  const openImagePicker = async (id, location) => {
    pickerSheet.current.expand();
    setselectedPicker({
      id,
      location,
    });
  };

  const isPickedImageEmpty = () => {
    if (selectedPicker) {
      if (selectedPicker.location == 'card') {
        return (
          formStateCard.inputValues[selectedPicker.id] == '' ||
          formStateCard.inputValues[selectedPicker.id] == undefined
        );
      } else {
        return (
          formStateDetail.inputValues[selectedPicker.id] == '' ||
          formStateDetail.inputValues[selectedPicker.id] == undefined
        );
      }
    } else {
      return false;
    }
  };



  const openPicker = (id, title, data) => {
    var selectedId;
    if (id == 'driver_company_id') {
      selectedId = formStateDetail.inputValues[id];
    } else if (id == 'bank_id') {
      selectedId = formStateBank.inputValues[id];
    } else {
      selectedId = formStateAddress.inputValues[id];
    }
    console.log(selectedId);
    navigation.navigate('Picker', {
      pickerId: id,
      title: title,
      data: data,
      selectedId: selectedId,
      isEdit: isEdit,
      previousRoute: 'Register'
    });
  };

 

  const closeDivision = () => {
    console.log('closing');
    bottomSheetModalRef.current.close();
  };

  useEffect(async () => {
    AsyncStorage.getItem(StorageKey.KEY_COMPANY).then(company => {
      setcompanyData(JSON.parse(company));
    });
    AsyncStorage.getItem(StorageKey.KEY_PROVINCE).then(province => {
      setprovinceData(JSON.parse(province));
    });
    AsyncStorage.getItem(StorageKey.KEY_BANK).then(bank => {
      setbankData(JSON.parse(bank));
    });

    translateForm()

  }, []);

  useEffect(() => {
    console.log(route.params);

    if (route.params?.pickerId) {
      const id = route.params.pickerId;
      if (id == 'driver_company_id') {
        dispatchDetail({
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
        });
        //make bank null if company is picked
        dispatchDetail({
          type: 'input',
          id: 'bank',
          input: null,
          isValid: true,
        });
        getUserBank(route.params.id).then(response => {
          const state = {
            inputValues: {
            bank_id: response.id,
            bank_id_value: response.bank_name,
            ...response

            },
            formIsValid: true
          }
          dispatchBank({
            type: 'update',
            state: state
          })
        })
      } else if (id == 'bank_id') {
        dispatchBank({
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
        });
      } else {
        dispatchAddress({
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
        });
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

  //preload region
  useEffect(() => {
    if (isEdit) {
      getCity(data.province.id).then(response => setcityData(response))
      getDistrict(data.city.id).then(response => setdistrictData(response))
      getVillage(data.district.id).then(response => { 
        setvillageData(response)
        setTimeout(() => {
          setpreloading(false)
        }, 500);
      }
      )
    }
  }, [])


  //reset if region changed
  useEffect(() => {
    if (!isEdit || !preloading) {
    dispatchAddress({
      type: 'picker',
      id: 'city_id',
      input: null,
      desc: null,
      isValid: false,
    });
    }
  }, [cityData]);

  useEffect(() => {
    if (!isEdit || !preloading) {

    dispatchAddress({
      type: 'picker',
      id: 'district_id',
      input: null,
      desc: null,
      isValid: false,
    });
    }
  }, [cityData, districtData]);

  useEffect(() => {
    if (!isEdit || !preloading) {
    dispatchAddress({
      type: 'picker',
      id: 'village_id',
      input: null,
      desc: null,
      isValid: false,
    });
    }
  }, [cityData, districtData, villageData]);


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        navigation={navigation}
        title={isEdit ? translate('edit_profile') : translate('register_form')}
        shadowEnabled={true}
      />
      <KeyboardAvoidingView
        style={{flex: 1, zIndex: -1}}
        behavior={Platform.OS == 'android' ? 'none' : 'padding'}>
        <ScrollView style={styles.container}>
          <View style={{paddingBottom: 40}}>
            {!isEdit && 
            <View>
            <LatoBold>{translate('register_form_title')}</LatoBold>
            <LatoRegular containerStyle={{marginTop: 5}}>
              {translate('register_form_desc')}
            </LatoRegular>
            </View>
        }

            <TouchableOpacity
              style={{alignItems: 'center', margin: 16}}
              onPress={() => openImagePicker('profile_image', 'Detail')}>
              <View>
                {formStateDetail.inputValues.profile_image_uri ? (
                  <Image
                    source={{
                      uri: formStateDetail.inputValues.profile_image ? formStateDetail.inputValues.profile_image_uri : getFullLink(formStateDetail.inputValues.profile_image_uri),
                    }}
                    style={{width: 80, height: 80, borderRadius: 50}}
                  />
                ) : (
                  <IconProfilePlaceholder />
                )}
                <IconProfileAddImage
                  style={{position: 'absolute', bottom: 0, right: 0}}
                />
              </View>
            </TouchableOpacity>

            <CustomInput
              id={'name'}
              title={translate('name_title')}
              placeholder={translate('name_placeholder')}
              value={formState.inputValues.name}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
              required
            />

            <PhoneInput
              id={'phone1'}
              title={translate('phone_title')}
              placeholder={translate('phone_placeholder')}
              dispatcher={dispatch}
              containerStyle={{marginVertical: 16}}
              value={formState.inputValues.phone1}
              isCheck={formState.isChecked}
            />

            <PhoneInput
              id={'phone2'}
              title={translate('phone_title2')}
              placeholder={translate('phone_placeholder')}
              dispatcher={dispatch}
              value={formState.inputValues.phone2}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'email'}
              title={translate('email_title')}
              placeholder={translate('email_placeholder')}
              containerStyle={{marginVertical: 16}}
              dispatcher={dispatch}
              value={formState.inputValues.email}
              isCheck={formState.isChecked}
              required
            />

            <PickerInput
              id={'driver_company_id'}
              title={translate('company_title')}
              placeholder={translate('company_placeholder')}
              value={formStateDetail.inputValues.driver_company_id_value}
              onPress={() =>
                openPicker('driver_company_id', 'company_title', companyData)
              }
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'address'}
              title={translate('address_title')}
              placeholder={translate('address_placeholder')}
              value={formStateAddress.inputValues.address}
              containerStyle={{marginVertical: 16}}
              dispatcher={dispatchAddress}
              isCheck={formState.isChecked}
              required
            />

            <PickerInput
              id={'province_id'}
              title={translate('province_title')}
              placeholder={translate('province_placeholder')}
              value={formStateAddress.inputValues.province_id_value}
              isCheck={formState.isChecked}
              onPress={() =>
                openPicker('province_id', 'province_title', provinceData)
              }
            />
            
            <PickerInput
              id={'city_id'}
              title={translate('city_title')}
              containerStyle={{paddingVertical: 16}}
              placeholder={translate('city_placeholder')}
              value={formStateAddress.inputValues.city_id_value}
              isCheck={formState.isChecked}
              disabled={formStateAddress.inputValues.province_id == null }
              onPress={() => openPicker('city_id', 'city_title', cityData)}
            />

            <PickerInput
              id={'district_id'}
              title={translate('district_title')}
              placeholder={translate('district_placeholder')}
              value={formStateAddress.inputValues.district_id_value}
              isCheck={formState.isChecked}
              disabled={formStateAddress.inputValues.city_id == null }
              onPress={() =>
                openPicker('district_id', 'district_title', districtData)
              }
            />

            <PickerInput
              id={'village_id'}
              title={translate('village_title')}
              containerStyle={{paddingVertical: 16}}
              placeholder={translate('village_placeholder')}
              value={formStateAddress.inputValues.village_id_value}
              isCheck={formState.isChecked}
              disabled={formStateAddress.inputValues.district_id == null }
              onPress={() =>
                openPicker('village_id', 'village_title', villageData)
              }
            />

              {formStateAddress.inputValues.village_id == null && formStateAddress.inputValues.village_id_value != null &&

            <CustomInput
              id={'village_name'}
              title={translate('manual_input')}
              containerStyle={{paddingBottom: 16}}
              placeholder={translate('village_placeholder')}
              value={formStateAddress.inputValues.village_name}
              isCheck={formState.isChecked}
              dispatcher={dispatchAddress}
              required
            />
              }

            <CustomInput
              id={'postal_code'}
              title={translate('postal_code_title')}
              placeholder={translate('postal_code_placeholder')}
              value={formStateAddress.inputValues.postal_code}
              dispatcher={dispatchAddress}
              isCheck={formState.isChecked}
              required
            />

            <GenderComponents
              containerStyle={{paddingVertical: 16}}
              selectedId={formStateDetail.inputValues.gender}
              isCheck={formState.isChecked}
              onPress={onGenderPicked}
            />

            <PickerInput
              id={'birth_date'}
              title={translate('birthdate_title')}
              placeholder={translate('birthdate_placeholder')}
              value={formStateDetail.inputValues.birth_date_value}
              isCheck={formState.isChecked}
              required
              onPress={() => setopenDate(true)}
            />
              { !isEdit && 
              <View>
                <PickerInput
                  id={'bank_id'}
                  title={translate('bank_title')}
                  placeholder={translate('bank_placeholder')}
                  containerStyle={{paddingVertical: 16}}
                  value={formStateBank.inputValues.bank_id_value}
                  isCheck={formState.isChecked}
                  required
                  disabled={formStateDetail.inputValues.driver_company_id }
                  onPress={() => openPicker('bank_id', 'bank_title', bankData)}
                />

                <CustomInput
                  id={'number'}
                  title={translate('bank_no_title')}
                  placeholder={translate('bank_no_placeholder')}
                  value={formStateBank.inputValues.number}
                  dispatcher={dispatchBank}
                  isCheck={formState.isChecked}
                  disabled={formStateDetail.inputValues.driver_company_id}
                  required
                />

                <CustomInput
                  id={'branch'}
                  title={translate('branch_title')}
                  placeholder={translate('branch_placeholder')}
                  containerStyle={{paddingVertical: 16}}
                  value={formStateBank.inputValues.branch}
                  dispatcher={dispatchBank}
                  isCheck={formState.isChecked}
                  disabled={formStateDetail.inputValues.driver_company_id}
                  required
                />

                <CustomInput
                  id={'name'}
                  title={translate('bank_owner_title')}
                  placeholder={translate('bank_owner_placeholder')}
                  value={formStateBank.inputValues.name}
                  dispatcher={dispatchBank}
                  isCheck={formState.isChecked}
                  disabled={formStateDetail.inputValues.driver_company_id}
                  required
                />
              </View>}

            <CustomInput
              id={'ktp'}
              title={translate('number', {string: translate('ktp')})}
              placeholder={translate('ktp_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.ktp}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
              required
            />

            <IDCard
              title={translate('ktp')}
              navigation={navigation}
              onPress={() => openImagePicker('ktp_image', 'card')}
              imageUri={formStateCard.inputValues.ktp_image_uri}
              isCheck={formState.isChecked}
              required
            />

            <CustomInput
              id={'sim_a'}
              title={translate('number', {string: translate('sim_a')})}
              placeholder={translate('sim_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.sim_a}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
              required
            />

              
            <IDCard
              title={translate('sim_a')}
              navigation={navigation}
              onPress={() => openImagePicker('sim_a_image', 'card')}
              imageUri={formStateCard.inputValues.sim_a_image_uri}
              isCheck={formState.isChecked}
              required
            />

            <CustomInput
              id={'sim_b'}
              title={translate('number', {string: translate('sim_b')})}
              placeholder={translate('sim_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.sim_b}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
            />

            <IDCard
              navigation={navigation}
              title={translate('sim_b')}
              onPress={() => openImagePicker('sim_b_image', 'card')}
              imageUri={formStateCard.inputValues.sim_b_image_uri}
            />

            <CustomButton
              types="primary"
              title={translate('next')}
              containerStyle={{marginTop: 16}}
              onPress={doRegister}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        open={openDate}
        mode="date"
        modal
        androidVariant="iosClone"
        date={new Date()}
        maximumDate={new Date()}
        onConfirm={onPickDate}
        onCancel={() => setopenDate(false)}
      />

      <CustomSheet ref={pickerSheet}>
        <View style={{padding: 16}}>
          <LatoBold>{translate('pick_photo')}</LatoBold>
          <TouchableOpacity
            onPress={() => setimagePickerId(1)}
            style={{marginVertical: 10}}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  shadowTop: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 0,
    padding: 16,
  },
  contentContainerStyle: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
  },
});

export default RegisterScreen;
