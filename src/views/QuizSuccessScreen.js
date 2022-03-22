import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  Image,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import {
  Subtitle1,
  Subtitle2,
  Desc2,
  Desc1,
} from '../components/atoms/CustomText';
import CustomButton from '../components/atoms/CustomButton';
import BackIcon from '../assets/images/ic_arrow_back_white.svg';
import InfoIcon from '../assets/images/ic_info.svg';
import translate from '../locales/translate';
import {getSettings} from '../services/settings';
import {getProfile} from '../services/user';
import {showDialog} from '../actions/commonActions';
import CustomSheet from '../components/atoms/CustomSheet';
import QuizClosedIcon from '../assets/images/ic_quiz_closed.svg';
import { getQuizAnswered } from '../services/utilities';

const SuccessScreen = ({navigation, route}) => {
  const isSuccess = route.params.isSuccess;
  const [isLoading, setisLoading] = useState(false);
  const quizClosedRef = useRef(null)

  const onPress = () => {
    if (isSuccess) {
      navigation.pop();
    } else {
      checkQuiz();
    }
  };

  const showQuizClosed = () => {
    quizClosedRef.current.expand();
  };

  const dismissQuizClosed = () => {
    quizClosedRef.current.close();
  };

  const checkQuiz = () => {
    setisLoading(true);
    getSettings()
      .then(response => {
        if (response.quiz == 0) {
          setisLoading(false);
          showQuizClosed();
        } else {
          getQuizAnswered()
            .then(profile => {
                setisLoading(false);
              if (profile.is_answered) {
                showDialog(translate('already_done_quiz'), false);
              } else {
                navigation.replace('MonthlyQuiz');
              }
            })
            .catch(err => {
                setisLoading(false);
              showDialog(err.message);
            });
        }
      })
      .catch(err => {
                setisLoading(false);
        showDialog(err.message);
      });
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: Colors.primary}} />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <View style={{flex: 1}}>
          <Image
            source={
              isSuccess
                ? require('../assets/images/img_finish_quiz.png')
                : require('../assets/images/img_start_quiz.png')
            }
            resizeMode="contain"
            style={{width: '100%', height: undefined, aspectRatio: 0.96, marginTop: -60}}
          />
          <View style={{position: 'absolute', padding: 16}}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <BackIcon />
            </TouchableOpacity>
          </View>
          <View style={{margin: 16, justifyContent: 'center'}}>
            <Subtitle1 style={{textAlign: 'center', marginTop: 24}}>
              {isSuccess
                ? translate('finish_quiz_title')
                : translate('start_quiz_title')}
            </Subtitle1>
            <Subtitle2
              style={{
                textAlign: 'center',
                marginTop: 10,
                color: Colors.secondText,
              }}>
              {isSuccess
                ? translate('finish_quiz_desc')
                : translate('start_quiz_desc')}
            </Subtitle2>
          </View>
          <View style={styles.infoContainer}>
            <InfoIcon />
            <View style={{paddingHorizontal: 10, flex: 1}}>
              <Subtitle2>{translate('info_employee_title')}</Subtitle2>
              <Desc1 style={{color: Colors.secondText, marginTop: 5}}>
                {translate('info_employee_desc')}
              </Desc1>
            </View>
          </View>
        </View>
        <CustomButton
          types="primary"
          containerStyle={{margin: 16}}
          isLoading={isLoading}
          title={
            isSuccess ? translate('back_to_home') : translate('start_working')
          }
          onPress={onPress}
        />
      </SafeAreaView>
      <CustomSheet ref={quizClosedRef}>
        <View style={{alignItems: 'center', padding: 16}}>
          <QuizClosedIcon />
          <Subtitle1 style={{alignSelf: 'center', marginTop: 16}}>
            {translate('quiz_closed_title')}
          </Subtitle1>
          <Subtitle2
            style={{
              alignSelf: 'center',
              marginTop: 16,
              color: Colors.secondText,
              textAlign: 'center',
            }}>
            {translate('quiz_closed_desc')}
          </Subtitle2>
          <CustomButton
            types="primary"
            title={translate('back')}
            containerStyle={{marginTop: 24, width: '100%'}}
            onPress={() => quizClosedRef.current.close()}
          />
        </View>
      </CustomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 10,
    borderColor: Colors.divider,
    borderWidth: 1,
    padding: 10,
  },
});

export default SuccessScreen;
