/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  StatusBar,
  AppState,
  Platform,
} from 'react-native';
import { LatoBold, Subtitle2 } from '../components/atoms/CustomText';
import Colors from '../constants/Colors';
import Splash from 'react-native-splash-screen'

import { getApplicationName, getVersion } from 'react-native-device-info';
import {
  showErrorAlert,
  checkAppVersion,
  showDialog,
  dismissDialog,
  getCalendarYear,
  showLocationAlwaysDialog,
  checkRemoteConfigVersion,
} from '../actions/commonActions';
import { Alert } from 'react-native';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';
import pkg from '../../package.json';
import { AuthContext } from '../../App';
import translate from '../locales/translate';
import { getBank, getColor, getCompanies, getDivisionApi, getGender, getProvince, getVehicleOwnership, getVehicleSticker, getVehicleType, getVehicleUsage } from '../services/utilities';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { useIsFocused } from '@react-navigation/native';
import IconLogo from '../assets/images/oto_logo.svg';
import IconBgBottom from '../assets/images/splash_bottom_bg.svg'
import IconBgTop from '../assets/images/splash_top_bg.svg'
import remoteConfig from '@react-native-firebase/remote-config';

import axios from 'axios';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Config from '../constants/Config';

const SplashScreen = ({ navigation, route }) => {
  Splash.hide();
  const { doneLoading } = useContext(AuthContext);
  const appVersion = getVersion();
  const isFocus = useIsFocused();


  // const [appState, setappState] = useState('active');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const showUpdateAlert = is_major => {
    Alert.alert(
      'Perhatian',
      is_major === true
        ? 'Untuk melanjutkan penggunaan aplikasi, anda harus melakukan pembaruan.'
        : 'Untuk kenyamanan anda menggunakan aplikasi, kami telah melakukan pembaruan.\n\nApakah anda ingin memperbarui aplikasi sekarang?',
      [
        {
          text: is_major === true ? 'Batal' : 'Lewati',
          onPress: () =>
            is_major === true ? BackHandler.exitApp() : loadAllData(),
        },
        {
          text: 'Unduh',
          onPress: () => {
            Platform.OS == 'android'
              ? Linking.openURL(
                'market://details?id=id.otomedia.android',
              )
              : Linking.openURL(
                'itms-apps://itunes.apple.com/app/apple-store/id1588342499?mt=8',
              );
          },
        },
      ],
    );
  };

  const requestNotificationPermission = async () => {
    const status = await messaging().requestPermission();
    if (status == messaging.AuthorizationStatus.DENIED) {
      showDialog(translate('enable_push_notif'), false, () =>
        Linking.openSettings(),
      );
    } else {
      getFirebaseToken();
    }
  };


  const getProvinceApi = async () => {
    getProvince()
      .then(response => {

        AsyncStorage.setItem(StorageKey.KEY_PROVINCE, JSON.stringify(response)).then(() => {
          getCompaniesApi()
        }).catch(err => {
          showDialog(JSON.stringify(err));
        })
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


  const getFirebaseToken = async () => {
    const authStatus = await messaging().requestPermission();
    const fMessagging = firebase.messaging()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      fMessagging.getToken().then(token => {
        AsyncStorage.setItem(StorageKey.KEY_FIREBASE_TOKEN, token)
        loadAllData()
      }).catch(err => {
        showDialog(err.message)
      })
    }
  }

  const showOpenSetting = () => {
    showDialog(translate('please_allow_location_always'), false, openSettings, () => navigation.pop(), translate('open_setting'), null, false)
  }

  const requestAndroidLocationPermission = () => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      console.log('background permission', result)
      if (result == RESULTS.GRANTED) {
        if (Platform.Version < 29) {
          getFirebaseToken()
          return
        } else {
          request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(result => {
            console.log('background permission', result)
            if (result == RESULTS.GRANTED) {
              getFirebaseToken()
              return
            }
          })
        }
        return
      }

      showOpenSetting()

    })
  }

  const requestBackgroundPermission = async () => {
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result == RESULTS.GRANTED) {
          requestNotificationPermission()
        } else {
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      })
    } else {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      console.log('result fine bois', result)
      if (result == RESULTS.DENIED) {
        // showOpenSetting()
        showLocationAlwaysDialog(() => {
          requestAndroidLocationPermission()
        })
        return
      }

      if (Platform.Version >= 29) {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
        console.log('result background', result)
        if (result == RESULTS.DENIED) {
          requestAndroidLocationPermission()
          return
        }

        if (result == RESULTS.BLOCKED) {
          showOpenSetting()
          return
        }
      }

      getFirebaseToken()

    }
  }

  const checkVersion = async () => {
    try {
            requestBackgroundPermission()
      // remoteConfig().fetchAndActivate().then((fetchedRemotely) => {
      //   remoteConfig().fetch(0).then((res) => {
      //     const minVersion = remoteConfig().getString(
      //       `${Platform.OS.toLowerCase()}_${Config.developmentMode}_version`
      //     )
      //     const isMajor = remoteConfig().getBoolean(
      //       `${Platform.OS.toLowerCase()}_${Config.developmentMode}_is_major`
      //     )

      //     const { _isMajor: is_major, updateAvailable } = checkRemoteConfigVersion(minVersion, isMajor, appVersion)

      //     if (updateAvailable) {
      //       showUpdateAlert(is_major);
      //     } else {
      //       requestBackgroundPermission()
      //     }
      //   })
      // })
    } catch (err) {
      console.log('err', err)
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

  const loadAllData = async () => {
    try {
      var ownership = await getVehicleOwnership()
      var sticker = await getVehicleSticker()
      var usage = await getVehicleUsage()
      var color = await getColor()
      var province = await getProvince()
      var companies = await getCompanies()
      var gender = await getGender()
      var bank = await getBank()
      if (province && companies && gender && bank && ownership && sticker && usage && color) {
        await AsyncStorage.setItem(StorageKey.KEY_PROVINCE, JSON.stringify(province))
        await AsyncStorage.setItem(StorageKey.KEY_COMPANY, JSON.stringify(companies))
        await AsyncStorage.setItem(StorageKey.KEY_GENDER, JSON.stringify(gender))
        await AsyncStorage.setItem(StorageKey.KEY_BANK, JSON.stringify(bank))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_OWNERSHIP, JSON.stringify(ownership))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_STICKER, JSON.stringify(sticker))
        await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_USAGE, JSON.stringify(usage))
        await AsyncStorage.setItem(StorageKey.KEY_COLOR, JSON.stringify(color))
        // print("saving done loading")
        doneLoading()
      }
    } catch (err) {
      showDialog(err.message)
    }

    // axios.all([
    //   getProvince(),
    //   getCompanies(),
    //   getGender(),
    //   getBank(),
    //   getVehicleOwnership(),
    //   getVehicleSticker(),
    //   getVehicleUsage(),
    //   getColor(),
    // ]).then(axios.spread(async (province, companies, gender, bank, ownership, sticker, usage, color) => {
    //   console.log('axios spread', province, companies)
    //   await AsyncStorage.setItem(StorageKey.KEY_PROVINCE, JSON.stringify(province))
    //   await AsyncStorage.setItem(StorageKey.KEY_COMPANY, JSON.stringify(companies))
    //   await AsyncStorage.setItem(StorageKey.KEY_GENDER, JSON.stringify(gender))
    //   await AsyncStorage.setItem(StorageKey.KEY_BANK, JSON.stringify(bank))
    //   await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_OWNERSHIP, JSON.stringify(ownership))
    //   await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_STICKER, JSON.stringify(sticker))
    //   await AsyncStorage.setItem(StorageKey.KEY_VEHICLE_USAGE, JSON.stringify(usage))
    //   await AsyncStorage.setItem(StorageKey.KEY_COLOR, JSON.stringify(color))
    //   doneLoading()
    // })).catch(err => {
    //   showDialog(err.message)
    // })
  }

  useEffect(() => {
    if (isFocus) {
      checkVersion()
      AsyncStorage.setItem(StorageKey.KEY_BACKGROUND_ACTIVE, JSON.stringify(false))
    }

    console.log('state', 'add listener');

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        requestBackgroundPermission()
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => subscription.remove();
  }, [isFocus]);

  return (

    <View style={{ flex: 1, color: Colors.primary }}>
      <StatusBar
        backgroundColor={'#0D233D'}
        barStyle="light-content"></StatusBar>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <IconBgTop
            preserveAspectRatio="none"
            height='100%'
          />
        </View>
        <IconLogo />
        <View style={{ flex: 1 }}>
          <IconBgBottom
            preserveAspectRatio="none"
            height='100%'
          />
        </View>
      </View>
      <View style={styles.versionContainer}>
        {/* <ActivityIndicator size="small" color={Colors.primary} /> */}
        <LatoBold style={{ color: 'black' }}>
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
    alignItems: 'center'
  },
  versionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white'
  },
});

export default SplashScreen;
