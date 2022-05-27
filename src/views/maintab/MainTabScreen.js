import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Platform, Keyboard} from 'react-native';

import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';
import OfferScreen from './offer/OfferScreen';
import AccountScreen from './account/AccountScreen';

import IconHome from '../../assets/images/ic_home.svg';
import IconOffer from '../../assets/images/ic_offer.svg';
import IconAccount from '../../assets/images/ic_account.svg';
import Colors from '../../constants/Colors';
import {AuthContext} from '../../../App';
import StorageKey from '../../constants/StorageKey';
import { initBackground } from '../../services/background';
import Realm from 'realm'
import moment from 'moment';
import { DistanceSchema, SpeedSchema } from '../../data/realm/speed';
import { calcDistance } from '../../actions/helper';
import { sendDistance } from '../../services/contract';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Config from '../../constants/Config';

const CustomBottomTabBar = props => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let keyboardEventListeners;
    if (Platform.OS === 'android') {
      keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', () => setVisible(false)),
        Keyboard.addListener('keyboardDidHide', () => setVisible(true)),
      ];
    }
    return () => {
      if (Platform.OS === 'android') {
        keyboardEventListeners &&
          keyboardEventListeners.forEach(eventListener => eventListener.remove());
      }
    };
  }, []);

  const render = () => {
    if (Platform.OS === 'ios') {
      return <BottomTabBar {...props} />;
    }
    if (!visible) return null;
    return <BottomTabBar {...props} />;
  };

  return render();
};

const Tab = createBottomTabNavigator();

const MainTabScreen = ({navigation, route}) => {

  const [isLogin, setisLogin] = useState(false);
  const currentPosition = useRef({
    latitude: 0,
    longitude: 0
  });
  const lastSentTime = useRef();
  const sumDistance = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN).then(token => {
      if (token) {
        setisLogin(true);
      } else {
        setisLogin(false);
      }
    });

    initBackground()

        BackgroundGeolocation.on('location', (location) => {
          // handle your locations here
          // to perform long running operation on iOS
          // you need to create background task

          console.log('location', location)
          BackgroundGeolocation.startTask(taskKey => {
            // execute long running task
            // eg. ajax post location
            // IMPORTANT: task has to be ended by endTask
            onLocationChange(location)
            BackgroundGeolocation.endTask(taskKey);
          });
        });

        AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(backround => {
          console.log('background', backround)
          if (JSON.parse(backround)) {
            BackgroundGeolocation.start()
          }
        })
    
  }, []);

  const onLocationChange = async (location) => {
    const distance = currentPosition?.current.latitude == 0 ? 0 : calcDistance(location.latitude, location.longitude, currentPosition?.current.latitude, currentPosition?.current.longitude)
    sumDistance.current += distance

    sendLocation(location)

    const schema = [SpeedSchema, DistanceSchema]

    try {
    const realm = await Realm.open(
      {
        path: 'otomedia',
        schema: schema,
      }
    )
    realm.write(() => {
      realm.create("Speed", {
        date: Date(),
        speed: location.speed
      })
      realm.create("Distance", {
        date: Date(),
        lat: location.latitude,
        lng: location.longitude,
        distance: distance
      })
    })
    } catch (err) {
      console.log(err)
    }
    currentPosition.current = {
      latitude: location.latitude,
      longitude: location.longitude
    }
  }

  const sendLocation = (location) => {
    if (!lastSentTime.current) {
      lastSentTime.current = moment(Date())
      return
    } else {
      const duration = moment.duration(lastSentTime.current.diff(moment(Date()))).asMinutes()
      
      console.log('momentDuration', duration)
      console.log('lastsenttime', lastSentTime)
      console.log('sumdistance', sumDistance.current)

      if (duration > Config.minimumTimeToSend) {
        return
      }
    }

    AsyncStorage.getItem(StorageKey.KEY_ACTIVE_CONTRACT).then(id => {
      sendDistance({
        lat: location.latitude,
        lng: location.longitude,
        distance: sumDistance.current * 1000, //in meter
        contract_id: id
      }).then(response => {
        sumDistance.current = 0
      }).catch(err => {

      })
    })

    lastSentTime.current = moment(Date())

  }

  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabelStyle: {fontSize: 13, marginBottom: 10},
        tabBarStyle: {height: Platform.OS == 'ios' ? 100 : 70},
        tabBarIconStyle: {marginTop: 5},
        tabBarIcon: ({focused, color, size}) => {
          let Icon;

          switch (route.name) {
            case 'Home':
              Icon = focused ? (
                <IconHome color={Colors.primary} />
              ) : (
                <IconHome color={Colors.grey} />
              );
              break;
            case 'Offer':
              Icon = focused ? (
                <IconOffer color={Colors.primary} />
              ) : (
                <IconOffer color={Colors.grey} />
              );
              break;
            default:
              Icon = focused ? (
                <IconAccount color={Colors.primary} />
              ) : (
                <IconAccount color={Colors.grey} />
              );
          }

          // You can return any component that you like here!
          return Icon;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Offer" component={OfferScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
