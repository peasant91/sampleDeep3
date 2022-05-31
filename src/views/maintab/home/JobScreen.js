import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LatoBold } from '../../../components/atoms/CustomText'
import Divider from '../../../components/atoms/Divider'
import NavBar from '../../../components/atoms/NavBar'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'

import IconStart from '../../../assets/images/ic_start.svg'
import IconStop from '../../../assets/images/ic_stop.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../../../constants/StorageKey'
import { average, calcDistance, getRealm, sum } from '../../../actions/helper'
import speed, { DistanceSchema } from '../../../data/realm/speed'
import { SpeedSchema } from '../../../data/realm/speed'
import { sendDistance } from '../../../services/contract'
import DistanceChart from '../../../components/atoms/DistanceChart'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import moment from 'moment'
import { makeMutable } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'


const JobScreen = ({ navigation, route }) => {

  const [time, settime] = useState(['00', '00', '00'])
  const [speed, setSpeed] = useState('00')
  const [distance, setDistance] = useState('00')
  const [isStart, setisStart] = useState()
  const loop = useRef()
  const lastSentTime = useRef()

  const currentPosition = useRef({
    latitude: 0,
    longitude: 0
  })

  const { id } = route.params

  const switchJob = () => {
    reset()
    AsyncStorage.setItem(StorageKey.KEY_DO_JOB, JSON.stringify(!isStart))
    AsyncStorage.setItem(StorageKey.KEY_ACTIVE_CONTRACT, JSON.stringify(id))

    if(!isStart) {
      checkBackroundLocation()
    } else {
      setisStart(!isStart)
    }


  }

  const checkBackroundLocation = async () => {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        console.log('result fine', result)
        if (result == RESULTS.DENIED) {
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
        
    setisStart(!isStart)
      
  }

  const reset = async () => {
    settime(['00', '00', '00'])
    setSpeed('00')
    setDistance('00')

    const schema = [SpeedSchema, DistanceSchema]

    const realm = await Realm.open(
      {
        path: 'otomedia',
        schema: schema,
      }
    )

    realm.write(() => realm.deleteAll())

  }

  const onLocationChange = async () => {

    const schema = [SpeedSchema, DistanceSchema]
    const realm = await Realm.open(
      {
        path: 'otomedia',
        schema: schema,
      }
    )

    const speeds = realm.objects('Speed')
    if (speeds.length > 0) {
      const averageSpeed = average(speeds.map(item => item.speed))
      setSpeed(averageSpeed.toFixed(2))
    }


    const distances = realm.objects('Distance')
    if (distances.length > 0) {
      const sumDistance = sum(distances.map(item => item.distance))
      setDistance(sumDistance.toFixed(2))
    }

  }

  const printTime = (time) => {
    loop.current = setInterval(() => {
      const startTime = moment(time)
      const now = moment(Date())
      const diff = moment.duration(now.diff(startTime)).asSeconds()
      const second = moment().startOf('day').seconds(diff).format('HH:mm:ss')
      console.log(second)
      settime(second.split(':'))
    }, 1000)
  }

  const checkTime = () => {
    AsyncStorage.getItem(StorageKey.KEY_START_TIME).then(time => {
      console.log('time', time)
      if (time) {
        printTime(time)
      } else {
        AsyncStorage.setItem(StorageKey.KEY_START_TIME, Date()).then(printTime(Date()))
      }
    })
  }

  const startBackgroundLocation = () => {
    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(background => {
      console.log(background)
      if (!JSON.parse(background)) {
        BackgroundGeolocation.start()
        AsyncStorage.setItem(StorageKey.KEY_BACKGROUND_ACTIVE, JSON.stringify(true))
      }
    })
  }

  const stopBackgroundLocation = () => {
    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(background => {
      if (background) {
        BackgroundGeolocation.stop()
        AsyncStorage.setItem(StorageKey.KEY_BACKGROUND_ACTIVE, JSON.stringify(false))
      }
    })
  }

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(StorageKey.KEY_DO_JOB).then(job => {
      if (job) {
        setisStart(JSON.parse(job))
      } else {
        setisStart(false)
      }
    })

    onLocationChange()

    const background = BackgroundGeolocation.on('location', (location) => {
      onLocationChange()
    })

    return () => { 
      clearInterval(loop.current)
      console.log('cleaning')
    }

  }, []))


  useFocusEffect(useCallback(() => {
    if (isStart != undefined) {

      if (isStart) {
        startBackgroundLocation()
        checkTime()
      } else {
        stopBackgroundLocation()
        AsyncStorage.removeItem(StorageKey.KEY_START_TIME).then(() => clearInterval(loop))
      }

    }

    return () => { 
      clearInterval(loop.current)
      console.log('cleaning')
    }
  }, [isStart]))


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
        <LatoBold style={{ fontSize: 18 }}>Km</LatoBold>
      </View>

      <Button
        title={translate(isStart ? 'stop' : 'start')}
        style={{ padding: 24, width: 180, alignSelf: 'center' }}
        containerStyle={{width: 180, padding: 24, alignSelf: 'center'}}
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