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
import {register} from '../../services/auth';
import NavBar from '../../components/atoms/NavBar';
import {Image} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import CustomSheet from '../../components/atoms/CustomSheet';

import IconProfilePlaceholder from '../../assets/images/ic_profile_placeholder.svg';
import IconProfileAddImage from '../../assets/images/ic_profile_add_image.svg';
import GenderComponents from '../../components/molecules/GenderComponents';
import IDCard from '../../components/atoms/IDCard';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import {getCity, getDistrict, getVillage} from '../../services/utilities';
import moment from 'moment';
import Colors from '../../constants/Colors';

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

  const [isLoading, setIsLoading] = useState(false);
  const [openDate, setopenDate] = useState(false)

  const pickerSheet = useRef()

  const [formStateBank, dispatchBank] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  });

  const [formStateAddress, dispatchAddress] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  });

  const [formStateCard, dispatchCard] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  });

  const [formStateDetail, dispatchDetail] = useReducer(formReducer, {
    inputValues: {
      bank: formStateBank.inputValues,
      address: formStateAddress.inputValues,
      gender: '',
    },
    inputValidities: {
      bank: formStateBank.formIsValid,
      address: formStateAddress.formIsValid,
      gender: false,
    },
    formIsValid: false,
  });

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      detail: formStateDetail.inputValues,
    },
    inputValidities: {
      detail: formStateDetail.formIsValid,
    },
    formIsValid: false && formStateDetail.formIsValid,
    isChecked: false,
  });

  const onSaveDivision = () => {
    closeDivision();

    setTimeout(() => {
      if (tempDivision.id) {
        dispatch({
          type: 'input',
          id: 'division_id',
          input: tempDivision.id,
          isValid: true,
        });
        dispatch({
          type: 'input',
          id: 'division_name',
          input: tempDivision.name,
          isValid: true,
        });
      }
    }, 600);
  };

  const doRegister = () => {
    dispatch({
      type: 'check',
    });

    console.log(navigation);

    if (formState.formIsValid) {
      setIsLoading(true);
      register(formState.inputValues)
        .then(response => {
          setIsLoading(false);
          goToSuccess();
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message, false);
        });
    }
  };

  const onGenderPicked = value => {
    dispatchDetail({
      id: 'gender',
      type: 'input',
      input: value,
      isValid: true,
    });
  };

  const onPickDate = date => {
    console.log(moment(date).format('YYYY-MM-DD'))
    setopenDate(false)
    dispatchDetail({
      type: 'picker',
      id: 'birth_date',
      input: moment(date).format('YYYY-MM-DD'),
      desc: moment(date).format('DD MMMM YYYY'),
      isValid: true
    })
  }

  const openImagePicker = async (id, location) => {
    pickerSheet.current.expand()
    // const result = await launchImageLibrary({
    //   quality: 0.5,
    //   includeBase64: true,
    //   mediaType: 'photo',
    // });
    // if (result) {
    //   if (location == 'card') {
    //     dispatchCard({
    //       type: 'input',
    //       id: id,
    //       input: result.assets[0].base64,
    //       isValid: true,
    //     });
    //     dispatchCard({
    //       type: 'input',
    //       id: id + '_uri',
    //       input: result.assets[0].uri,
    //       isValid: true,
    //     });
    //   } else {
    //     dispatchDetail({
    //       type: 'input',
    //       id: id,
    //       input: result.assets[0].base64,
    //       isValid: true,
    //     });
    //     dispatchDetail({
    //       type: 'input',
    //       id: id + '_uri',
    //       input: result.assets[0].uri,
    //       isValid: true,
    //     });
    //   }
    // }

    console.log(result);
    console.log(formStateBank);
  };

  const goToSuccess = () => {
    navigation.replace('Success', {
      title: translate('register_success_title'),
      desc: translate('register_success_desc'),
      image: require('../../assets/images/img_register_success.png'),
      buttonTitle: translate('go_to_login'),
      onPress: () => {
        navigation.pop();
      },
    });
  };

  const openPicker = (id, title, data) => {
    var selectedId;
    if (id == 'driver_company_id') {
      selectedId = formState.inputValues.detail[id];
    } else if (id == 'bank') {
      selectedId = formState.inputValues.detail.bank[id];
    } else {
      selectedId = formState.inputValues.detail.address[id];
    }
    console.log(selectedId);
    navigation.navigate('Picker', {
      pickerId: id,
      title: title,
      data: data,
      selectedId: selectedId,
    });
  };

  const openDivision = () => {
    setTimeout(() => {
      bottomSheetModalRef.current.expand();
    }, 100);
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
      } else if (id == 'bank_id') {
        dispatchBank({
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
        })
      }
      else {
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
            setvillageData(villageData)
          })
        }
      }
    }
  }, [route.params]);

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



  //if state detail change, change also in parent state
  useEffect(() => {
    dispatch({
      type: 'input',
      id: 'detail',
      input: formStateDetail.inputValues,
      isValid: formStateDetail.formIsValid,
    });
  }, [formStateDetail]);

  //if state bank change, change also in parent detail state
  useEffect(() => {
    dispatchDetail({
      type: 'input',
      id: 'bank',
      input: formStateBank.inputValues,
      isValid: formStateBank.formIsValid,
    });
  }, [formStateBank]);

  //if state bank change, change also in parent detail state
  useEffect(() => {
    dispatchDetail({
      type: 'input',
      id: 'address',
      input: formStateAddress.inputValues,
      isValid: formStateAddress.formIsValid,
    });
  }, [formStateAddress]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        navigation={navigation}
        title={translate('register_form')}
        shadowEnabled={true}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'android' ? 'none' : 'padding'}>
        <ScrollView style={styles.container}>
          <View style={{flex: 1}}>
            <LatoBold>{translate('register_form_title')}</LatoBold>
            <LatoRegular containerStyle={{marginTop: 5}}>
              {translate('register_form_desc')}
            </LatoRegular>

            <TouchableOpacity
              style={{alignItems: 'center', margin: 16}}
              onPress={() => openImagePicker('profile_image', 'Detail')}>
              <View>
                {formStateDetail.inputValues.profile_image_uri ? (
                  <Image
                    source={{
                      uri: formStateDetail.inputValues.profile_image_uri,
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
              onPress={() => openPicker('city_id', 'city_title', cityData)}
            />

            <PickerInput
              id={'district_id'}
              title={translate('district_title')}
              placeholder={translate('district_placeholder')}
              value={formStateAddress.inputValues.district_id_value}
              isCheck={formState.isChecked}
              onPress={() => openPicker('district_id', 'district_title', districtData)}
            />

            <PickerInput
              id={'village_id'}
              title={translate('village_title')}
              containerStyle={{paddingVertical: 16}}
              placeholder={translate('village_placeholder')}
              value={formStateAddress.inputValues.village_id_value}
              isCheck={formState.isChecked}
              onPress={() => openPicker('village_id', 'village_title', villageData)}
            />

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

              {!formState.inputValues.detail.driver_company_id &&
              <View>
            <PickerInput
              id={'bank_id'}
              title={translate('bank_title')}
              placeholder={translate('bank_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateBank.inputValues.bank_id_value}
              isCheck={formState.isChecked}
              required
              onPress={() => openPicker('bank_id', 'bank_title', bankData)}
            />

            <CustomInput
              id={'number'}
              title={translate('bank_no_title')}
              placeholder={translate('bank_no_placeholder')}
              value={formStateBank.inputValues.number}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
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
              required
            />

            <CustomInput
              id={'name'}
              title={translate('bank_owner_title')}
              placeholder={translate('bank_owner_placeholder')}
              value={formStateBank.inputValues.name}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
              required
            />
            </View>}

            <CustomInput
              id={'identity_card'}
              title={translate('number', {string: translate('ktp')})}
              placeholder={translate('ktp_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.identity_card}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
              required
            />

            <IDCard
              title={translate('ktp')}
              onPress={() => openImagePicker('identity_card_image', 'card')}
              imageUri={formStateCard.inputValues.identity_card_image_uri}
              isCheck={formState.isChecked}
              required
            />

            <CustomInput
              id={'driver_license_a'}
              title={translate('number', {string: translate('sim_a')})}
              placeholder={translate('sim_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.driver_license_a}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
              required
            />

            <IDCard
              title={translate('sim_a')}
              onPress={() => openImagePicker('driver_license_a_image', 'card')}
              imageUri={formStateCard.inputValues.driver_license_a_image_uri}
              isCheck={formState.isChecked}
              required
            />

            <CustomInput
              id={'driver_license_b'}
              title={translate('number', {string: translate('sim_b')})}
              placeholder={translate('sim_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateCard.inputValues.driver_license_b}
              dispatcher={dispatchCard}
              isCheck={formState.isChecked}
            />

            <IDCard
              title={translate('sim_b')}
              onPress={() => openImagePicker('driver_license_b_image', 'card')}
              imageUri={formStateCard.inputValues.driver_license_b_image_uri}
            />

            <CustomButton
              types="primary"
              title={translate('register_now')}
              containerStyle={{marginTop: 16}}
              onPress={doRegister}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
      open={openDate}
      mode='date'
      modal
      androidVariant='iosClone'
      date={new Date()}
      maximumDate={new Date()}
      onConfirm={onPickDate}
      onCancel={() => setopenDate(false)}
      />

<CustomSheet ref={pickerSheet}>
        <View style={{alignItems: 'center', padding: 16}}>
          <LatoBold style={{alignSelf: 'center', marginTop: 16}}>
            {translate('operational_time_title')}
          </LatoBold>
          <LatoRegular
            style={{
              alignSelf: 'center',
              marginTop: 16,
              color: Colors.secondText,
              textAlign: 'center',
            }}>
            {translate('operational_time_desc')}
          </LatoRegular>
          <CustomButton
            title={translate('send_whatsapp')}
            containerStyle={{width: '100%', marginTop: 12}}
            onPress={openPicker}
          />
          <CustomButton
            types="primary"
            title={translate('i_understand')}
            containerStyle={{marginTop: 12, width: '100%'}}
            onPress={openPicker}
          />
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
