import React, { useEffect, useState, useRef } from 'react'
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


const JobScreen = ({ navigation, route }) => {

  const [time, settime] = useState(['00', '00', '00'])
  const [speed, setSpeed] = useState('00')
  const [distance, setDistance] = useState('00')
  const [isStart, setisStart] = useState()
  const [isBackgroundActive, setisBackgroundActive] = useState()
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

  const sendLocation = (distance, location) => {
    if (!lastSentTime.current) {
      lastSentTime.current = moment(Date())
    } else {
      const duration = moment.duration(lastSentTime.current.diff(moment(Date()))).asMinutes()

      console.log('momentDuration', duration)
      console.log('lastsenttime', lastSentTime)

      if (duration > -1) {
        return
      }
    }


    AsyncStorage.getItem(StorageKey.KEY_ACTIVE_CONTRACT).then(id => {
      sendDistance({
        lat: location.latitude,
        lng: location.longitude,
        distance: distance * 1000, //in meter
        contract_id: id
      }).then(response => {

      }).catch(err => {

      })
    })

    lastSentTime.current = moment(Date())

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

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(background => {
      setisBackgroundActive(JSON.parse(background))
      AsyncStorage.getItem(StorageKey.KEY_DO_JOB).then(job => {
        if (job) {
          setisStart(JSON.parse(job))
        } else {
          setisStart(false)
        }
      })
    })

    onLocationChange()
    

  }, [])

  useEffect(() => {
  
      BackgroundGeolocation.on('location', (location) => {
        onLocationChange()
      })

    return () => {
    }
  }, [])
  

  useEffect(() => {
    if (isStart != undefined && isBackgroundActive != undefined) {

      if (!isBackgroundActive && isStart) {
        BackgroundGeolocation.start()
      }

      if (isBackgroundActive && !isStart) {
        BackgroundGeolocation.stop()
        setisBackgroundActive(false)
        AsyncStorage.setItem(StorageKey.KEY_BACKGROUND_ACTIVE, JSON.stringify(false))
      }
    }
  }, [isStart, isBackgroundActive])


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