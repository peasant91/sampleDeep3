import React from 'react';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';
import translate from '../locales/translate';

export const initBackground = () => {
  if (Platform.OS === 'ios') {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
  } else {
    check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {});
  }
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    interval: 1000,
    fastestInterval: 1000,
    activitiesInterval: 1000,
    notificationTitle: translate('on_work_title'),
    notificationText: translate('on_work_desc'),
    notificationsEnabled: true,
    debug: false,
    startOnBoot: true,
    stopOnTerminate: true,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    stopOnStillActivity: false,
    startForeground: true,
    // url: 'http://192.168.81.15:3000/location',
    // httpHeaders: {
    //   'X-FOO': 'bar'
    // },
    // customize post properties
    // postTemplate: {
    //   lat: '@latitude',
    //   lon: '@longitude',
    //   foo: 'bar' // you can also add your own properties
    // }
  });

  BackgroundGeolocation.on('stationary', stationaryLocation => {
    // handle stationary locations here
    // Actions.sendLocation(stationaryLocation);
    console.log('stationary', stationaryLocation);
  });

  BackgroundGeolocation.on('error', error => {
    console.log('[ERROR] BackgroundGeolocation error:', error);
  });

  BackgroundGeolocation.on('start', () => {
    AsyncStorage.setItem(
      StorageKey.KEY_BACKGROUND_ACTIVE,
      JSON.stringify(true),
    );
    console.log('[INFO] BackgroundGeolocation service has been started');
  });

  BackgroundGeolocation.on('stop', () => {
    AsyncStorage.setItem(
      StorageKey.KEY_BACKGROUND_ACTIVE,
      JSON.stringify(false),
    );
    console.log('[INFO] BackgroundGeolocation service has been stopped');
  });

  BackgroundGeolocation.on('authorization', status => {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      // we need to set delay or otherwise alert may not be shown
      setTimeout(
        () =>
          Alert.alert(
            'App requires location tracking permission',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
                onPress: () => BackgroundGeolocation.showAppSettings(),
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel',
              },
            ],
          ),
        1000,
      );
    }
  });

  BackgroundGeolocation.on('background', () => {
    console.log('[INFO] App is in background');
  });

  BackgroundGeolocation.on('foreground', () => {
    console.log('[INFO] App is in foreground');
  });
};
