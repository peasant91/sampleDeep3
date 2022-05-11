import React, { useEffect, useState } from 'react'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LatoBold } from '../../../components/atoms/CustomText'
import Divider from '../../../components/atoms/Divider'
import NavBar from '../../../components/atoms/NavBar'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import IconStart from '../../../assets/images/ic_start.svg'
import IconStop from '../../../assets/images/ic_stop.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../../../constants/StorageKey'
import { getRealm } from '../../../actions/helper'


const JobScreen = ({ navigation, route }) => {

  const [time, settime] = useState(['00', '00', '00'])
  const [speed, setSpeed] = useState('00')
  const [distance, setDistance] = useState('00')
  const [isStart, setisStart] = useState(false)
  let realm

  const switchJob = () => {
    AsyncStorage.setItem(StorageKey.KEY_DO_JOB, JSON.stringify(!isStart))
    setisStart(!isStart)
  }

  const onLocationChange = (location) => {
    realm.write(() => {
      realm.create("Speed", {
        _date: Date(),
        speed: location.speed
      })
    })
  }

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_DO_JOB).then(job => {
      if (job) {
        setisStart(JSON.parse(job))
      } else {
        setisStart(false)
      }
    })
    getRealm(SpeedSchema).then(realms => {
      realm = realms
    })
  }, [])

  useEffect(() => {
    if (isStart) {

      if (Platform.OS === 'ios') {

        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then((result) => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)');
                break;
              case RESULTS.DENIED:
                console.log('The permission has not been requested / is denied but requestable');
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
          .catch((error) => {
            // …
          });
      } else {
        check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
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
        }).catch(error => {

        })
      }
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        notificationsEnabled: true,
        debug: true,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        stopOnStillActivity: false,
        startForeground: true
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

      BackgroundGeolocation.on('location', (location) => {
        // handle your locations here
        // to perform long running operation on iOS
        // you need to create background task

        console.log('location', location)
        onLocationChange(location)
        BackgroundGeolocation.startTask(taskKey => {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask
          BackgroundGeolocation.endTask(taskKey);
        });
      });

      BackgroundGeolocation.on('stationary', (stationaryLocation) => {
        // handle stationary locations here
        // Actions.sendLocation(stationaryLocation);
        console.log('stationary', stationaryLocation)
      });

      BackgroundGeolocation.on('error', (error) => {
        console.log('[ERROR] BackgroundGeolocation error:', error);
      });

      BackgroundGeolocation.on('start', () => {
        console.log('[INFO] BackgroundGeolocation service has been started');
      });

      BackgroundGeolocation.on('stop', () => {
        console.log('[INFO] BackgroundGeolocation service has been stopped');
      });

      BackgroundGeolocation.on('authorization', (status) => {
        console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          setTimeout(() =>
            Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
              { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
              { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
            ]), 1000);
        }
      });

      BackgroundGeolocation.on('background', () => {
        console.log('[INFO] App is in background');
      });

      BackgroundGeolocation.on('foreground', () => {
        console.log('[INFO] App is in foreground');
      });

      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }

  }, [isStart])


  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <NavBar title={translate('do_job')} navigation={navigation} />
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 2 }}>
        <LatoBold style={{ fontSize: 18 }}>{translate('time')}</LatoBold>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <LatoBold containerStyle={styles.time} style={{ fontSize: 38 }}>{time[0]}</LatoBold>
          <LatoBold containerStyle={{ padding: 5 }} style={{ fontSize: 38 }}>:</LatoBold>
          <LatoBold containerStyle={styles.time} style={{ fontSize: 38 }}>{time[1]}</LatoBold>
          <LatoBold containerStyle={{ padding: 5 }} style={{ fontSize: 38 }}>:</LatoBold>
          <LatoBold containerStyle={styles.time} style={{ fontSize: 38 }}>{time[2]}</LatoBold>
        </View>
      </View>

      <Divider />

      <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 3 }}>
        <LatoBold style={{ fontSize: 18 }}>{translate('average_speed')}</LatoBold>
        <LatoBold style={{ fontSize: 48, marginTop: 24 }}>{speed}</LatoBold>
        <LatoBold style={{ fontSize: 18 }}>Km/s</LatoBold>
      </View>

      <Divider />

      <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 3 }}>
        <LatoBold style={{ fontSize: 18 }}>{translate('distance')}</LatoBold>
        <LatoBold style={{ fontSize: 48, marginTop: 24 }}>{distance}</LatoBold>
        <LatoBold style={{ fontSize: 18 }}>Km/s</LatoBold>
      </View>

      <Button
        title={'start'}
        style={{ padding: 24, width: 180, alignSelf: 'center' }}
        buttonStyle={{ borderRadius: 25, height: 50, backgroundColor: isStart ? 'red' : Colors.primarySecondary }}
        iconPosition={'left'}
        titleStyle={{ padding: 5 }}
        icon={!isStart ? IconStart : IconStop}
        onPress={switchJob}
      />

    </View>
  </SafeAreaView>

}

const styles = StyleSheet.create({
  time: {
    backgroundColor: Colors.divider,
    padding: 5,
    borderRadius: 10
  },
})

export default JobScreen