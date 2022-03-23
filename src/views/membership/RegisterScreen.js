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
import {get, post} from '../../services/baseApi';
import {showDialog, dismissDialog} from '../../actions/commonActions';
import ListDivision from '../../components/atoms/list/ListDivision';
import {getDivisionApi} from '../../services/utilities';
import {register} from '../../services/auth';
import NavBar from '../../components/atoms/NavBar';
import {Image} from 'react-native-elements';

import IconProfilePlaceholder from '../../assets/images/ic_profile_placeholder.svg';
import IconProfileAddImage from '../../assets/images/ic_profile_add_image.svg';
import GenderComponents from '../../components/molecules/GenderComponents';
import IDCard from '../../components/atoms/IDCard';
import { launchImageLibrary } from 'react-native-image-picker';

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
  const [division, setDivision] = useState([...dummyDivision]);
  const [tempDivision, setTempDivision] = useState({});
  const [contentHeight, setContentHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const {bottom: safeBottomArea} = useSafeAreaInsets();

  const [formStateBank, dispatchBank] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
  });

  const [formStateDriver, dispatchDriver] = useReducer(formReducer, {
    inputValues: {
      bank: formStateBank.inputValues,
    },
    inputValidities: {
      bank: formStateBank.formIsValid,
    },
    formIsValid: false,
  });

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      driver: formStateDriver.inputValues,
    },
    inputValidities: {
      driver: formStateDriver.formIsValid,
    },
    formIsValid: false && formStateDriver.formIsValid,
    isChecked: false,
  });

  useEffect(() => {
    dispatch({
      type: 'input',
      id: 'driver',
      input: formStateDriver.inputValues,
      isValid: formStateDriver.formIsValid,
    });
  }, [formStateDriver]);

  useEffect(() => {
    dispatchDriver({
      type: 'input',
      id: 'bank',
      input: formStateBank.inputValues,
      isValid: formStateBank.formIsValid,
    });
  }, [formStateBank]);

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

    if (!formState.formIsValid) {
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

  const openImagePicker = async (id, location) => {
    const result = await launchImageLibrary({quality: 0.5, includeBase64: true, mediaType: 'photo'})
    if (result) {
      if (location == 'bank') {

        dispatchBank({
          type: 'input',
          id: id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchBank({
          type: 'input',
          id: id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
      }
        else {
        dispatchDriver({
          type: 'input',
          id: id,
          input: result.assets[0].base64,
          isValid: true,
        });
        dispatchDriver({
          type: 'input',
          id: id + '_uri',
          input: result.assets[0].uri,
          isValid: true,
        });
        }
    }


    console.log(result)
    console.log(formStateBank)
  }

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
    navigation.navigate('Picker', {id: id, title: title, data: data})
  }

  const openDivision = () => {
    setTimeout(() => {
      bottomSheetModalRef.current.expand();
    }, 100);
  };

  const closeDivision = () => {
    console.log('closing');
    bottomSheetModalRef.current.close();
  };

  useEffect(() => {}, []);

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

            <TouchableOpacity style={{alignItems: 'center', margin: 16}} onPress={() => openImagePicker('profile_image', 'driver')}>
              <View>
              {formStateDriver.inputValues.profile_image_uri ? 

                <Image source={{uri: formStateDriver.inputValues.profile_image_uri}} style={{width: 80, height: 80, borderRadius: 50}}/>
                :
                <IconProfilePlaceholder />
              }
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
            />

            <PhoneInput
              id={'phone1'}
              title={translate('phone_title')}
              placeholder={translate('phone_placeholder')}
              dispatcher={dispatch}
              containerStyle={{marginVertical: 16}}
              isCheck={formState.isChecked}
            />

            <PhoneInput
              id={'phone2'}
              title={translate('phone_title2')}
              placeholder={translate('phone_placeholder')}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'email'}
              title={translate('email_title')}
              placeholder={translate('email_placeholder')}
              containerStyle={{marginVertical: 16}}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'driver_company_id'}
              title={translate('company_title')}
              placeholder={translate('company_placeholder')}
              value={formStateDriver.inputValues.company}
              onPress={() => openPicker('driver_company_id', 'company_title', companyData)}
              optional
            />

            <CustomInput
              id={'address'}
              title={translate('address_title')}
              placeholder={translate('address_placeholder')}
              value={formStateDriver.inputValues.address}
              containerStyle={{marginVertical: 16}}
              dispatcher={dispatchDriver}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'province_id'}
              title={translate('province_title')}
              placeholder={translate('province_placeholder')}
              value={formStateDriver.inputValues.company}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'city_id'}
              title={translate('city_title')}
              containerStyle={{paddingVertical: 16}}
              placeholder={translate('city_placeholder')}
              value={formStateDriver.inputValues.city}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'district_id'}
              title={translate('district_title')}
              placeholder={translate('district_placeholder')}
              value={formStateDriver.inputValues.district}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'village_id'}
              title={translate('village_title')}
              containerStyle={{paddingVertical: 16}}
              placeholder={translate('village_placeholder')}
              value={formStateDriver.inputValues.village}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'postal_code'}
              title={translate('postal_code_title')}
              placeholder={translate('postal_code_placeholder')}
              value={formStateDriver.inputValues.postal_code}
              dispatcher={dispatchDriver}
              isCheck={formState.isChecked}
            />

            <GenderComponents
              containerStyle={{paddingVertical: 16}}
              selectedId={formStateDriver.inputValues.gender}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'birth_date'}
              title={translate('birthdate_title')}
              placeholder={translate('birthdate_placeholder')}
              value={formStateDriver.inputValues.birth_date}
              isCheck={formState.isChecked}
            />

            <PickerInput
              id={'bank_id'}
              title={translate('bank_title')}
              placeholder={translate('bank_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateBank.inputValues.bank_id}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'number'}
              title={translate('bank_no_title')}
              placeholder={translate('bank_no_placeholder')}
              value={formStateBank.inputValues.number}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'branch'}
              title={translate('branch_title')}
              placeholder={translate('branch_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateBank.inputValues.branch}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'name'}
              title={translate('bank_owner_title')}
              placeholder={translate('bank_owner_placeholder')}
              value={formStateBank.inputValues.name}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
            />

            <CustomInput
              id={'identity_card'}
              title={translate('ktp_title')}
              placeholder={translate('ktp_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateBank.inputValues.identity_card}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
            />

            <IDCard title={translate('take_ktp_image')} onPress={() => openImagePicker('identity_card_image', 'bank')} imageUri={formStateBank.inputValues.identity_card_image_uri}/>

            <CustomInput
              id={'driver_license'}
              title={translate('sim_title')}
              placeholder={translate('sim_placeholder')}
              containerStyle={{paddingVertical: 16}}
              value={formStateBank.inputValues.driver_license}
              dispatcher={dispatchBank}
              isCheck={formState.isChecked}
            />

            <IDCard title={translate('take_sim_image')} onPress={() => openImagePicker('driver_license_image', 'bank')} imageUri={formStateBank.inputValues.driver_license_image_uri}/>

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
