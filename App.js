/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useMemo, useEffect, useState, createRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import { ThemeProvider, Icon } from 'react-native-elements';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorageKey from './src/constants/StorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { default as Splash } from 'react-native-splash-screen';
import { ModalPortal } from 'react-native-modals';
import { ToastProvider } from 'react-native-toast-notifications';
import { navigationRef } from './src/navigation/RootNavigation';
import * as RootNavigation from './src/navigation/RootNavigation';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import translate from './src/locales/translate';

import SplashScreen from './src/views/SplashScreen';
import LoginScreen from './src/views/membership/LoginScreen';
import RegisterScreen from './src/views/membership/RegisterScreen';
import RegisterPasswordScreen from './src/views/membership/RegisterPasswordScreen';
import ForgotPasswordScreen from './src/views/membership/ForgotPasswordScreen';
import SuccessScreen from './src/views/SuccessScreen';
import ChangePasswordScreen from './src/views/membership/ChangePasswordScreen';
import SingleWebScreen from './src/views/SingleWebScreen';
import PickerScreen from './src/views/PickerScreen';
import ImageViewerScreen from './src/views/ImageViewerScreen';
import OtpScreen from './src/views/membership/OtpScreen'
import RegisterSuccessScreen from './src/views/membership/RegisterSuccessScreen';
import RegisterVehicleScreen from './src/views/membership/RegisterVehicleScreen';
import RegisterVehicleSuccessScreen from './src/views/membership/RegisterVehicleSuccessScreen';
import NotificationScreen from './src/views/NotificationScreen';
import ResetPasswordScreen from './src/views/membership/ResetPasswordScreen';
import ForgotPasswordSuccessScreen from './src/views/membership/ForgotPasswordSuccessScreen';
import OfferDetailScreen from './src/views/maintab/offer/OfferDetailScreen';
import CurrentContractScreen from './src/views/maintab/offer/CurrentContractScreen';
import ContractHistoryScreen from './src/views/maintab/offer/ContractHistoryScreen';
import BankScreen from './src/views/maintab/account/BankScreen';
import JobScreen from './src/views/maintab/home/JobScreen';
import InstallationListScreen from './src/views/maintab/offer/InstallationListScreen';
import TripDetailScreen from './src/views/maintab/offer/TripDetailScreen';
import CrudReportScreen from './src/views/maintab/offer/CrudReportScreen';
import IncomeDetailScreen from './src/views/maintab/account/IncomeDetailScreen';

import Colors from './src/constants/Colors';
import messaging from '@react-native-firebase/messaging';
import CustomisableAlert from 'react-native-customisable-alert';
import Config from './src/constants/Config';
import MainTabScreen from './src/views/maintab/MainTabScreen';
import { logout } from './src/services/user';
import { showDialog } from './src/actions/commonActions';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import notifee, { EventType } from '@notifee/react-native';
import { DistanceSchema, SpeedSchema } from './src/data/realm/speed';

//realm

// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


const theme = {
  colors: {
    primary: Colors.primary,
    colorPrimary: Colors.primary,
    primaryColor: Colors.primary,
  },
};

const translationGetters = {
  en: () => require('./src/locales/en.json'),
  jp: () => require('./src/locales/jp.json'),
};

const setI18nConfig = () => {
  const fallback = { languageTag: 'en' };
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;
  translate.cache.clear();
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

const Stack = createNativeStackNavigator();
export const AuthContext = React.createContext();

const App = ({ navigation, route }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      console.log('App js action', action)
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'LOADING_COMPLETE':
          return {
            ...prevState,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  const [initialRoute, setInitialRoute] = useState('Home');
  const [loading, setLoading] = useState(true);
  const [pushNotifParam, setpushNotifParam] = useState(undefined);
  const enableAnimation = false;

  setI18nConfig();

  const authContextValue = useMemo(
    () => ({
      signIn: async data => {
        console.log('dispatch login');
        try {
          console.log('uid', uid)
          const uid = await AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN);
          if (Config.isMockDesign) {
            dispatch({ type: 'SIGN_IN', token: "mock" });
          } else {
            dispatch({ type: 'SIGN_IN', token: uid });
          }
        } catch (err) {
          console.log(err);
        }
      },
      signOut: async data => {
        logout().then(response => {
          BackgroundGeolocation.stop()
          const schema = [SpeedSchema, DistanceSchema];

          Realm.open({
            path: 'otomedia',
            schema: schema,
          }).then(realm => {
            realm.write(() => realm.deleteAll());
            AsyncStorage.removeItem(StorageKey.KEY_ACCESS_TOKEN).then(_ => {
              AsyncStorage.removeItem(StorageKey.KEY_ELAPSED_TIME).then(_ =>{
                dispatch({ type: 'SIGN_OUT' });
              })
            })
            
          })
        }).catch(err => {
          BackgroundGeolocation.stop()
          const schema = [SpeedSchema, DistanceSchema];

          Realm.open({
            path: 'otomedia',
            schema: schema,
          }).then(realm => {
            realm.write(() => realm.deleteAll());
            AsyncStorage.removeItem(StorageKey.KEY_ACCESS_TOKEN).then(_ => {
              AsyncStorage.removeItem(StorageKey.KEY_ELAPSED_TIME).then(_ =>{
                dispatch({ type: 'SIGN_OUT' });
              })
            })
          })
        })
      },
      doneLoading: async data => {
        dispatch({ type: 'LOADING_COMPLETE' });
      },
    }),
    [],
  );

  const saveFirebaseToken = token => {
    AsyncStorage.setItem(StorageKey.KEY_FIREBASE_TOKEN, token);

  };

  useEffect(() => {
    Splash.hide();

    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN);
        console.log('token' + userToken);
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const requestNotifPermission = async () => {
    try {
      await notifee.requestPermission()
      const status = await messaging().requestPermission();
      if (status === messaging.AuthorizationStatus.AUTHORIZED || status === messaging.AuthorizationStatus.PROVISIONAL) {
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log("MESSAGE - ON NOTIFICATION OPEN APP", remoteMessage);
        });
        messaging().getInitialNotification().then(remoteMessage => {
          console.log("MESSAGE - INITIAL FUNCTION");
          console.log(remoteMessage);
        });
        return
      } else {
        requestNotifPermission()
      }
    } catch (err) {
      console.log("request notif permission error", err);
    }
  }

  useEffect(() => {
    requestNotifPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("remove messaging", remoteMessage);
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      const data = remoteMessage.data
      if (data) {
        await notifee.displayNotification({
          title: data.title,
          body: data.body,
          data: data,
          android: {
            channelId
          }
        })
      }
    })
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveFirebaseToken(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveFirebaseToken(token);
    });
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      const data = remoteMessage.data
      switch (data.type.toLowerCase()) {
        case 'account':
          RootNavigation.navigate('Account');
          break;
        case 'contract_detail':
          RootNavigation.navigate('CurrentContract', {
            id: data.model_id,
            isEmpty: false,
            isCurrent: true,
          })
          break;
        case 'contract_history':
          RootNavigation.navigate('CurrentContract', {
            id: data.model_id,
            isEmpty: false,
            isCurrent: false,
          })
          break;
        case 'offer_list':
          RootNavigation.navigate('Offer');
          break;
        default:
          RootNavigation.navigate('IncomeDetail');
          break;
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log("initial noti");
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute('Home');
          setpushNotifParam({ id: remoteMessage.data.news_id }); // e.g. "Settings"
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    //handle foreground events
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type == EventType.PRESS) {
        const data = detail.notification?.data
        if (data) {
          console.log('notif data foreground', data)
          const id = data['model_id']
          const type = data['type']
          switch (type.toLowerCase()) {
            case 'account':
              RootNavigation.navigate('Account');
              break;
            case 'contract_detail':
              RootNavigation.navigate('CurrentContract', {
                id: id,
                isEmpty: false,
                isCurrent: true,
              })
              break;
            case 'contract_history':
              RootNavigation.navigate('CurrentContract', {
                id: id,
                isEmpty: false,
                isCurrent: false,
              })
              break;
            case 'offer_list':
              RootNavigation.navigate('Offer');
              break;
            default:
              break;
          }
        }
      }
    })
  }, [])

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>

      <ThemeProvider theme={theme}>
        <CustomisableAlert
          titleStyle={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        />
        <ToastProvider
          renderType={{
            custom: toast => (
              <View
                style={{
                  padding: 15,
                  backgroundColor: Colors.darkPrimary,
                  borderRadius: 32,
                }}>
                <Text style={{ color: 'white', fontFamily: 'Lato-Regular' }}>
                  {toast.message}
                </Text>
              </View>
            ),
          }}>
          <NavigationContainer ref={navigationRef}>
            <AuthContext.Provider value={authContextValue}>
              <Stack.Navigator initialRouteName={initialRoute}>
                {state.isLoading ? (
                  <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                  />
                ) : !state.userToken ? (
                  <>
                    <Stack.Screen
                      name="Login"
                      component={LoginScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="Register"
                      component={RegisterScreen}
                      options={{ headerShown: false }}
                      initialParams={{ isEdit: false }}
                    />

                    <Stack.Screen
                      name="RegisterPassword"
                      component={RegisterPasswordScreen}
                      initialParams={{ data: {} }}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="RegisterVehicle"
                      component={RegisterVehicleScreen}
                      options={{ headerShown: false }}
                      initialParams={{ isEdit: false }}
                    />


                    <Stack.Screen
                      name="ResetPassword"
                      component={ResetPasswordScreen}
                      options={{ headerShown: false }}
                    />



                    <Stack.Screen
                      name="RegisterSuccess"
                      component={RegisterSuccessScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="ForgotPassword"
                      component={ForgotPasswordScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="ForgotPasswordSuccess"
                      component={ForgotPasswordSuccessScreen}
                      options={{ headerShown: false }}
                    />


                    <Stack.Screen
                      name="RegisterVehicleSuccess"
                      component={RegisterVehicleSuccessScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="OtpScreen"
                      component={OtpScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="ImageViewer"
                      component={ImageViewerScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Picker"
                      component={PickerScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Success"
                      component={SuccessScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="SingleWeb"
                      component={SingleWebScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />
                  </>
                ) : (
                  <>

                    <Stack.Screen
                      name="MainTab"
                      component={MainTabScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                      initialParams={{ news: pushNotifParam }}
                    />

                    <Stack.Screen
                      name="RegisterVehicleMain"
                      component={RegisterVehicleScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="IncomeDetail"
                      component={IncomeDetailScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="InstallationList"
                      component={InstallationListScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="EditProfile"
                      component={RegisterScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="TripDetail"
                      component={TripDetailScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="CrudReport"
                      component={CrudReportScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="Notification"
                      component={NotificationScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="RegisterVehicleSuccessMain"
                      component={RegisterVehicleSuccessScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="ImageViewer"
                      component={ImageViewerScreen}
                      options={{ headerShown: false }}
                    />


                    <Stack.Screen
                      name="OfferDetail"
                      component={OfferDetailScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="Picker"
                      component={PickerScreen}
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="CurrentContract"
                      component={CurrentContractScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="ContractHistory"
                      component={ContractHistoryScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="ChangePassword"
                      component={ChangePasswordScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="Bank"
                      component={BankScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="SingleWeb"
                      component={SingleWebScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="Job"
                      component={JobScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation }}
                    />

                    <Stack.Screen
                      name="Success"
                      component={SuccessScreen}
                      options={{ headerShown: false, animationEnabled: enableAnimation, gestureEnabled: false }}
                    />
                  </>
                )}
              </Stack.Navigator>
              <ModalPortal />
            </AuthContext.Provider>
          </NavigationContainer>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
