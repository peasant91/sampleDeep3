import React, {useReducer, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, ScrollView, View} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import {Headline1, Subtitle2} from '../components/atoms/CustomText';
import translate from '../locales/translate';
import CustomInput from '../components/atoms/CustomInput';
import CustomButton from '../components/atoms/CustomButton';
import formReducer from '../reducers/formReducer';
import {forgotPassword} from '../services/auth';
import {showDialog} from '../actions/commonActions';

const ForgotPasswordScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
    },
    inputValidites: {
      email: false,
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
      <ScrollView style={{flex: 1}}>
        <NavBar navigation={navigation} />
        <View style={{flex: 1, margin: 16}}>
        <Headline1 style={{marginTop: 16}}>
          {translate('forgot_password_title')}
        </Headline1>
        <Subtitle2 style={{marginTop: 10}}>
          {translate('forgot_password_desc')}
        </Subtitle2>
        <CustomInput
          id="email"
          value={formState.inputValues.email}
          containerStyle={{marginVertical: 16}}
          title={translate('email_title')}
          placeholder={translate('email_placeholder')}
          isCheck={formState.isChecked}
          dispatcher={dispatch}
        />
        <CustomButton
          containerStyle={{marginTop: 10}}
          types="primary"
          title={translate('send')}
          onPress={onEmailSend}
          isLoading={isLoading}
        />
          </View>
      </ScrollView>
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
