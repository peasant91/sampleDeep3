import React, {useReducer, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, ScrollView, View} from 'react-native';
import formReducer from '../../reducers/formReducer';
import {forgotPassword} from '../../services/auth';
import {showDialog} from '../../actions/commonActions';

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
