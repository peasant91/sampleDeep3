import React, {useReducer, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, ScrollView, View} from 'react-native';
import formReducer from '../../reducers/formReducer';
import {forgotPassword} from '../../services/auth';
import {showDialog} from '../../actions/commonActions';
import CustomButton from '../../components/atoms/CustomButton';
import translate from '../../locales/translate';
import NavBar from '../../components/atoms/NavBar';
import { LatoRegular } from '../../components/atoms/CustomText';
import { PhoneInput } from '../../components/atoms/CustomInput';

const ForgotPasswordScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      address: '',
    },
    inputValidites: {
      address: false,
    },
    isChecked: false,
    formIsValid: false,
  });

  const onOtpSend = () => {
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setIsLoading(true);
      forgotPassword(formState.inputValues)
        .then(response => {
          setIsLoading(false);
          goToOtp(response);
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message, false);
        });
    }
  };

  const goToOtp = (response) => {
    navigation.navigate('OtpScreen', {
      data: {
        email: response.address,
        phone: formState.inputValues.address,
        otpId: response.id
      },
      isRegister: false
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar title={translate('forgot_password')} navigation={navigation}/>
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 16}}>
          <LatoRegular>{translate('forgot_password_desc')}</LatoRegular>
          <PhoneInput 
          id={'address'}
          containerStyle={{paddingTop: 16}}
          title={translate('phone_title')}
          dispatcher={dispatch}
          value={formState.inputValues.address}
          placeholder={translate('phone_placeholder')}
          isCheck={formState.isChecked}
          />
        </View>
      </ScrollView>
      <CustomButton containerStyle={{padding: 16}} types={'primary'} title={translate('next')} onPress={onOtpSend} isLoading={isLoading}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ForgotPasswordScreen;
