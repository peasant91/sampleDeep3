import React, {useReducer, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput, {PasswordInput} from '../../components/atoms/CustomInput';
import NavBar from '../../components/atoms/NavBar';
import translate from '../../locales/translate';
import formReducer from '../../reducers/formReducer';
import {resetPassword} from '../../services/auth';

const ResetPasswordScreen = ({navigation, route}) => {
  const {otpId} = route.params;
  const [isLoading, setisLoading] = useState(false);

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {},
    inputValidities: {},
    formIsValid: false,
    isChecked: false,
  });

  const doResetPassword = () => {
    console.log('otpId', otpId);
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setisLoading(true);
      resetPassword({
        ...formState.inputValues,
        otp_id: otpId,
      })
        .then(response => {
          setisLoading(false);
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}, {name: 'ForgotPasswordSuccess'}],
          });
        })
        .catch(error => {
          setisLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NavBar title={translate('reset_password')} navigation={navigation} />
      <View style={{padding: 16, flex: 1}}>
        <PasswordInput
          id={'password'}
          title={translate('new_password_title')}
          placeholder={translate('password_placeholder')}
          password={translate('password_placeholder')}
          dispatcher={dispatch}
          value={formState.inputValues.password}
          isCheck={formState.isChecked}
        />
        <PasswordInput
          containerStyle={{marginTop: 16}}
          id={'password_confirmation'}
          title={translate('confirm_password_title')}
          placeholder={translate('conf_password_placeholder')}
          password={translate('password_placeholder')}
          dispatcher={dispatch}
          isCheck={formState.isChecked}
          value={formState.inputValues.password_confirmation}
          match={formState.inputValues.password}
        />
      </View>
      <CustomButton
        types={'primary'}
        title={translate('reset_password')}
        onPress={doResetPassword}
        isLoading={isLoading}
        containerStyle={{padding: 16}}
      />
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
