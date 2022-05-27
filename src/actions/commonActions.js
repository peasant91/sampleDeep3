import {Alert, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {getBundleId} from 'react-native-device-info';
import LottieView from 'lottie-react-native';

export const ERROR = 'ACTION_ERROR';
export const CLEAR_ERROR = 'CLEAR_ACTION_ERROR';
import GenericCustomAlert from '../components/molecules/GenericCustomAlertComponents';
import DialogManager, {
  ScaleAnimation,
  DialogContent,
} from 'react-native-dialog-component';
import DialogComponent from 'react-native-dialog-component/dist/DialogComponent';
import getClientVersioning from '../services/getClientVersioning';
import CustomText, { LatoBold, LatoRegular, Subtitle1 } from '../components/atoms/CustomText';
import translate from '../locales/translate';
import CustomButton from '../components/atoms/CustomButton';
import {getErrorMessage} from '../services/baseApi';
import {ModalPortal} from 'react-native-modals';
import moment from 'moment';
import {showAlert, closeAlert} from 'react-native-customisable-alert';

let id = 0;

export const showDialog = (
  message,
  isDoubleButton,
  positiveAction,
  negativeAction,
  positiveTitle,
  negativeTitle,
  isReversed
) => {
  console.log('alert dialog show');
  // DialogManager.show({
  //     animationDuration: 0,
  //     ScaleAnimation: new ScaleAnimation(),
  //     width: '80%',
  //     dialogStyle: { borderRadius: 16, width: '80%' },
  //     dismissOnTouchOutside: false,
  //     children: (

  //         <GenericCustomAlert
  //             dialogTitle={message}
  //             isDoubleButton={isDoubleButton}
  //             onPositivePress={positiveAction ? positiveAction : () => dismissDialog()}
  //             onNegativePress={negativeAction ? negativeAction : () => dismissDialog()}
  //             positiveTitle={positiveTitle}
  //             negativeTitle={negativeTitle} />
  //     ),
  // }, () => {
  //     console.log('callback - show');
  // });
    showAlert({
      alertType: 'custom',
      animationIn: 'fadeIn',
      animationOut: 'fadeOut',
      customAlert: (
        <GenericCustomAlert
          dialogTitle={message}
          isDoubleButton={isDoubleButton}
          onPositivePress={() => {
            if (positiveAction) {
              positiveAction()
            }
            dismissDialog()
          }}
          onNegativePress={
            () => {
              if (negativeAction) {
                negativeAction()
              }
              dismissDialog()
            }}
          positiveTitle={positiveTitle}
          negativeTitle={negativeTitle}
          isReversed={isReversed}
        />
      ),
    });
  
};

export const showLoadingDialog = message => {
  console.log('alert dialog show');
  showAlert({
    alertType: 'custom',
    animationIn: 'fadeIn',
    animationOut: 'fadeOut',
    customAlert: (
        <View style={styles.mainContainer}>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            autoPlay
            loop
            style={{width: 200, height: 100, alignSelf: 'center'}}
            source={require('../assets/lottie/download.json')}
          />
          <Subtitle1
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              marginBottom: 10,
              alignSelf: 'center',
              textAlign: 'center'
            }}>
            {message}
          </Subtitle1>
        </View>
      ),
          });
};

export const showLocationAlwaysDialog = (onConfirm) => {
  DialogManager.show(
    {
      animationDuration: 0,
      ScaleAnimation: new ScaleAnimation(),
      width: '80%',
      dialogStyle: {borderRadius: 16, width: '80%'},
      dismissOnTouchOutside: false,
      children: (
        <View style={{margin: 20}}>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            autoPlay
            loop
            style={{width: 200, height: 100, alignSelf: 'center'}}
            source={require('../assets/lottie/location.json')}
          />
          <LatoBold style={{textAlign: 'center', alignSelf: 'center'}}>{translate('always_location_title')}</LatoBold>
          <LatoRegular
            containerStyle={{marginVertical: 16}}
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 12,
              marginBottom: 10,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {translate('always_location_desc')}
          </LatoRegular>
          <CustomButton
            types="primary"
            onPress={() => { DialogManager.dismiss(); onConfirm() }}
            title={translate('understand')}
          />
        </View>
      ),
    },
    () => {
      console.log('callback - show');
    },
  );
}

export const showSuccessDialog = message => {
  DialogManager.show(
    {
      animationDuration: 0,
      ScaleAnimation: new ScaleAnimation(),
      width: '80%',
      dialogStyle: {borderRadius: 16, width: '80%'},
      dismissOnTouchOutside: false,
      children: (
        <View style={{margin: 20}}>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            autoPlay
            loop
            style={{width: 200, height: 100, alignSelf: 'center'}}
            source={require('../assets/lottie/success.json')}
          />
          <CustomText
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              marginBottom: 10,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {message}
          </CustomText>
          <CustomButton
            types="primary"
            onPress={() => DialogManager.dismiss()}
            title={translate('ok')}
          />
        </View>
      ),
    },
    () => {
      console.log('callback - show');
    },
  );
};

export const dismissDialog = () => {
  console.log('wadpw');
  closeAlert()

  //   DialogManager.dismissAll(() => {});
};

export const clearError = () => {
  return {type: CLEAR_ERROR};
};

export const checkAppVersion = async version => {
  try {
    const response = await getClientVersioning.get('/version', {
      params: {
        package: getBundleId(),
        version: version,
      },
    });
    return response.data.data;
  } catch (error) {
    getErrorMessage(error);
  }
};

export const getCalendarYear = () => {
  console.log(moment().isoWeek(1));
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    marginVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: '80%',
    maxWidth: '80%',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});