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
  TouchableOpacity
} from 'react-native';
import BackButton from '../assets/images/ic_arrow_back.svg';
import CustomText, {
  Headline1,
  Subtitle2,
  Subtitle1,
  LatoBold,
  LatoRegular,
} from '../components/atoms/CustomText';
import translate from '../locales/translate';
import CustomButton from '../components/atoms/CustomButton';
import CustomInput, {
  PhoneInput,
  PickerInput,
  PasswordInput,
} from '../components/atoms/CustomInput';
import Colors from '../constants/Colors';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import formReducer from '../reducers/formReducer.js';
import {get, post} from '../services/baseApi';
import {showDialog, dismissDialog} from '../actions/commonActions';
import ListDivision from '../components/atoms/list/ListDivision';
import {getDivisionApi} from '../services/utilities';
import {register} from '../services/auth';
import NavBar from '../components/atoms/NavBar';
import { Image } from 'react-native-elements';

import IconProfilePlaceholder from '../assets/images/ic_profile_placeholder.svg'
import IconProfileAddImage from '../assets/images/ic_profile_add_image.svg'

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

  const [formStateDriver, dispatchDriver] = useReducer(formReducer, {
    inputValues: {
      province_id: 51,
      city_id: 5171
    },
    inputValidities: {
     province_id: false,
     city_id: false
    },
    formIsValid: false,
    isCheck: false,
  });

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      name: '',
      employee_id: '',
      email: '',
      phone_code: '62',
      phone: '',
      division_id: '',
      division_name: '',
      password: '',
      repassword: '',
      driver: formStateDriver.inputValues
    },
    inputValidities: {
      name: false,
      employee_id: false,
      email: false,
      phone_code: true,
      phone: false,
      division_id: false,
      password: false,
      repassword: false,
    },
    formIsValid: false && formStateDriver.formIsValid,
    isCheck: false,
  });



  const getDivision = () => {
    getDivisionApi()
      .then(response => {
        setDivision(response);
      })
      .catch(error => {
        showDialog(
          error.message,
          true,
          () => {
            dismissDialog();
            getDivision();
          },
          () => {
            dismissDialog();
          },
        );
      });
  };

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

    console.log(navigation)

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

  const goToSuccess = () => {
    navigation.replace('Success', {
      title: translate('register_success_title'),
      desc: translate('register_success_desc'),
      image: require('../assets/images/img_register_success.png'),
      buttonTitle: translate('go_to_login'),
      onPress: () => {
        navigation.pop();
      },
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

  useEffect(() => {
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar navigation={navigation} title={translate('register_form')} shadowEnabled={true}/>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'android' ? 'none' : 'padding'}  >

      <ScrollView style={styles.container}>
        <View >

        <LatoBold>{translate('register_form_title')}</LatoBold>
        <LatoRegular containerStyle={{marginTop: 5}}>{translate('register_form_desc')}</LatoRegular>
        
        <View style={{alignItems: 'center', margin: 16}}>
          <View>
          <IconProfilePlaceholder/>
          <IconProfileAddImage style={{position: 'absolute', bottom: 0, right: 0}}/>
          </View>
        </View>

        <CustomInput 
          id={'name'}
          title={translate('name_title')}
          placeholder={translate('name_placeholder')}
          dispatcher={dispatch}/>

          <PhoneInput
          id={'phone1'}
          title={translate('phone_title')}
          placeholder={translate('phone_placeholder')}
          dispatcher={dispatch}
          containerStyle={{marginVertical: 16}}
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16
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
