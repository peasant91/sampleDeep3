import React, {useReducer, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView
} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import {Subtitle1} from '../components/atoms/CustomText';
import CustomInput, {
  PickerInput,
  PhoneInput,
} from '../components/atoms/CustomInput';
import CustomButton from '../components/atoms/CustomButton';
import formReducer from '../reducers/formReducer';
import {sendQuestion} from '../services/forms';
import {dismissDialog, showDialog} from '../actions/commonActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';
import {getMeetingDate} from '../services/utilities';

const QuestionFormScreen = ({navigation, route}) => {
  const {profile} = route.params;
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      phone_code: '+62',
      phone: profile.phone,
      question: '',
      email: profile.email,
    },
    inputValidities: {
      phone_code: true,
      phone: true,
      email: true,
      question: false,
    },
    isChecked: false,
    formIsValid: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendForm = () => {
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setIsLoading(true);
      sendQuestion(formState.inputValues)
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
      title: translate('question_success_title'),
      desc: translate('question_success_desc'),
      image: require('../assets/images/img_success_question.png'),
      buttonTitle: translate('back_to_home'),
      onPress: () => {
        navigation.pop();
      },
    });
  };

  useEffect(async () => {
    // const profile = await AsyncStorage.getItem(StorageKey.KEY_USER_PROFILE)
    // dispatch({
    //     type: 'input',
    //     id: 'phone',
    //     input: JSON.parse(profile).phone,
    //     isValid: true
    // })
    // dispatch({
    //     type: 'input',
    //     id: 'email',
    //     input: JSON.parse(profile).email,
    //     isValid: true
    // })
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        title={translate('question_answer')}
        navigation={navigation}
        style={{padding: 10}}
      />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'android' ? 'none' : 'padding'}>
        <ScrollView style={styles.container}>
          <View>
            <Subtitle1>
              {translate('insert_data')}
              <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
            </Subtitle1>
            <PhoneInput
              id="phone"
              value={formState.inputValues.phone}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
              containerStyle={{marginTop: 16}}
              title={translate('phone_title')}
              placeholder={translate('phone_placeholder')}
            />
            <CustomInput
              id="email"
              value={formState.inputValues.email}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
              containerStyle={{marginTop: 16}}
              title={translate('email_title')}
              placeholder={translate('email_placeholder')}
            />
            <CustomInput
              id="question"
              value={formState.inputValues.question}
              dispatcher={dispatch}
              isCheck={formState.isChecked}
              maxChar={1000}
              multiline
              containerStyle={{marginTop: 16}}
              title={translate('question_title')}
              placeholder={translate('question_placeholder')}
            />
          </View>
        </ScrollView>
      <CustomButton
        containerStyle={{margin: 16}}
        types="primary"
        title={translate('send')}
        onPress={sendForm}
        isLoading={isLoading}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
});

export default QuestionFormScreen;
