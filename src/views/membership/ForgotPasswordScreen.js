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
      phone: '',
    },
    inputValidites: {
      phone: false,
    },
    isChecked: false,
    formIsValid: false,
  });

  const onEmailSend = () => {
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setIsLoading(true);
      forgotPassword(formState.inputValues)
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
    navigation.navigate('ForgotPasswordSent', {
      email: formState.inputValues.email,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar title={translate('forgot_password')}/>
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 16}}>
          <LatoRegular>{translate('forgot_password_desc')}</LatoRegular>
          <PhoneInput 
          containerStyle={{paddingTop: 16}}
          title={translate('phone_title')}
          dispatcher={dispatch}
          placeholder={translate('phone_placeholder')}
          />
        </View>
      </ScrollView>
      <CustomButton containerStyle={{padding: 16}} types={'primary'} title={translate('next')}/>
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
