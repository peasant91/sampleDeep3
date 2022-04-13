/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  StatusBar,
  AppState,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {LatoBold, Subtitle2} from '../components/atoms/CustomText';
import Colors from '../constants/Colors';
import {default as Splash} from 'react-native-splash-screen';
import {getApplicationName, getVersion} from 'react-native-device-info';
import {
  showErrorAlert,
  checkAppVersion,
  showDialog,
  dismissDialog,
  getCalendarYear,
} from '../actions/commonActions';
import {Alert} from 'react-native';
import {BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';
import pkg from '../../package.json';
import {AuthContext} from '../../App';
import translate from '../locales/translate';
import ImageTopLogo from '../assets/images/img_top_logo.svg';
import {getBank, getColor, getCompanies, getDivisionApi, getGender, getProvince, getVehicleOwnership, getVehicleSticker, getVehicleType, getVehicleUsage} from '../services/utilities';
import {Freshchat, FreshchatConfig} from 'react-native-freshchat-sdk';
import Constant from '../constants/Constant';
import {postFreshchat} from '../services/freshchat';
import {getCalendarWeek} from '../data/dummy';
import {getNumberFormatSettings} from 'react-native-localize';
import {getSettings} from '../services/settings';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';

import BGSplash from '../assets/background/bg_splash.svg'
import axios from 'axios';

const SplashScreen = props => {
  Splash.hide();
  const {doneLoading} = useContext(AuthContext);
  const appVersion = getVersion();
  const isFocus = useIsFocused();
  // const [appState, setappState] = useState('active');
  var appState = 'active'

  const showUpdateAlert = response => {
    Alert.alert(
      'Perhatian',
      response.is_major === true
        ? 'Untuk melanjutkan penggunaan aplikasi, anda harus melakukan pembaruan.'
        : 'Untuk kenyamanan anda menggunakan aplikasi, kami telah melakukan pembaruan.\n\nApakah anda ingin memperbarui aplikasi sekarang?',
      [
        {
          text: response.is_major === true ? 'Batal' : 'Lewati',
          onPress: () =>
            response.is_major === true ? BackHandler.exitApp() : getProvinceApi(),
        },
        {
          text: 'Unduh',
          onPress: () => {
            Platform.OS == 'android'
              ? Linking.openURL(
                  'market://details?id=com.schott.pbsaving.android',
                )
              : Linking.openURL(
                  'itms-apps://itunes.apple.com/app/apple-store/id1588342499?mt=8',
                );
          },
        },
      ],
    );
  };

  const requestPermission = async () => {
    const status = await messaging().requestPermission();
    if (status == messaging.AuthorizationStatus.DENIED) {
      showDialog(translate('enable_push_notif'), false, () =>
        Linking.openSettings(),
      );
    } else {
      checkVersion();
    }
  };

  const getProvinceApi = async () => {
    getProvince()
      .then(response => {
        AsyncStorage.setItem(StorageKey.KEY_PROVINCE, JSON.stringify(response))
          .then(response => getCompaniesApi())
          .catch(err => console.log(err));
      })
      .catch(err => {
        showDialog(err.message);
      });
  };


  const getCompaniesApi = async () => {
    getCompanies()
      .then(response => {
        getGenderApi()
        AsyncStorage.setItem(StorageKey.KEY_COMPANY, JSON.stringify(response))
      })
      .catch(err => {
        showDialog(err.message);
      });
  }

  const getGenderApi = async () => {
    getGender()
      .then(response => {
        getBankApi()
        AsyncStorage.setItem(StorageKey.KEY_GENDER, JSON.stringify(response))
      })
      .catch(err => {
        showDialog(err.message);
      });
  }

  const getBankApi = async () => {
    getBank()
      .then(response => {
        doneLoading()
        AsyncStorage.setItem(StorageKey.KEY_BANK, JSON.stringify(response))
      })
      .catch(err => {
        showDialog(err.message);
      });
  }

  const initFreshchat = () => {
    const freshchatConfig = new FreshchatConfig(
      Constant.FRESHCHAT_APP_ID,
      Constant.FRESHCHAT_KEY,
    );
    freshchatConfig.domain = Constant.FRESHCHAT_DOMAIN;
    Freshchat.init(freshchatConfig);

    Freshchat.addEventListener(
      Freshchat.EVENT_USER_RESTORE_ID_GENERATED,
      () => {
        console.log('onRestoreIdUpdated triggered');
        Freshchat.getUser(user => {
          var restoreId = user.restoreId;
          var externalId = user.externalId;
          postFreshchat({freshchat_id: restoreId})
            .then(response => {})
            .catch(err => showDialog(err.message, false));
          console.log('externalId: ' + externalId);
          console.log('restoreId: ' + restoreId);
        });
      },
    );
  };

  const clearAppData = async () => {
    try {
      // await AsyncStorage.clear();

      clear.clearAppCache(() => {
        console.log('清理缓存成功');
      });

      clear.clear;

      clear.getAppCacheSize((value, unit) => {
        console.log('缓存大小', value);
        console.log('缓存单位', unit);
      });
      console.log('masuk gan');
    } catch (error) {
      console.error('Error clearing app data.', error);
    }
  };

  const checkVersion = async () => {
    try {
      const response = await checkAppVersion(appVersion);
      const token = await AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN);
      if (response.need_update === true) {
        showUpdateAlert(response);
        // if (Constant.RESET) {
        //   clearAppData();
        // }
      } else {
        getProvinceApi()
        // token
        //   ? props.navigation.navigate('MainFlow')
        //   : props.navigation.navigate('Welcome');
      }
    } catch (err) {
      showDialog(
        err.message,
        false,
        () => {
          checkVersion();
          dismissDialog();
        },
        null,
        translate('retry'),
      );
    }
  };

  const handleAppStateChange = nextAppState => {
    console.log('state', nextAppState);
    console.log('prevstate', appState);
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('request permission');
      requestPermission();
    }

    appState = nextAppState

  };

  useEffect(() => {
    // getCalendarYear();
    // checkVersion();
    if (isFocus) {
      axios.all([
        getProvince(),
        getCompanies(),
        getGender(),
        getBank(),
        getVehicleOwnership(),
        getVehicleSticker(),
        getVehicleUsage(),
        getColor(),
      ]).then(axios.spread(async (province, companies, gender, bank, ownership, sticker, usage, color) => {
        console.log('axios spread', province, companies)
        await AsyncStorage.setItem(StorageKey.KEY_PROVINCE, JSON.stringify(province))
        await AsyncStorage.setItem(StorageKey.KEY_COMPANY, JSON.stringify(companies))
        await AsyncStorage.setItem(StorageKey.KEY_GENDER, JSON.stringify(gender))
        await AsyncStorage.setItem(StorageKey.KEY_BANK, JSON.stringify(bank))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_OWNERSHIP, JSON.stringify(ownership))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_STICKER, JSON.stringify(sticker))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_USAGE, JSON.stringify(usage))
        await AsyncStorage.setItem(StorageKey.KEY_COLOR, JSON.stringify(color))
        doneLoading()
      }))
      // getProvinceApi();
      // requestPermission();
      // initFreshchat();
    }

    AppState.addEventListener('change', handleAppStateChange);
    console.log('state', 'add listener');
    // getCalendarWeek();
    // const willFocusSub = props.navigation.addListener('willFocus', () => {
    //   checkVersion()
    // });

    return () => {};
  }, [isFocus]);

  return (

    <View style={{flex: 1, color: Colors.primary}}>
      <StatusBar
        backgroundColor={'#0D233D'}
        barStyle="light-content"></StatusBar>
      <View style={styles.container}>
        <Image
          source={require('../assets/background/bg_splash.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode='contain'
        />
        {/* <BGSplash style={{width: '100%', height: '100%'}} /> */}
        {/* <Image source={require('../assets/images/img_top_logo.png')} /> */}
      </View>
      <View style={styles.versionContainer}>
        {/* <ActivityIndicator size="small" color={Colors.primary} /> */}
        <LatoBold style={{color: 'black'}}>
          Ver. {appVersion} {pkg.mode == 'dev' ? 'dev' : ''}
        </LatoBold>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionContainer: {
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    padding: 16,
    bottom: 16,
  },
});

export default SplashScreen;
