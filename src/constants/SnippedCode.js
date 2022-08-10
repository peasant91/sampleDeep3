/*
import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Platform, Keyboard, Alert} from 'react-native';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
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
import {initBackground} from '../../services/background';
import Realm from 'realm';
import moment from 'moment';
import {DistanceSchema, SpeedSchema} from '../../data/realm/speed';
import {calcDistance} from '../../actions/helper';
import {getTrafficFlow, sendDistance} from '../../services/contract';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Config from '../../constants/Config';
import {useToast} from 'react-native-toast-notifications';
import {sum} from '../../actions/helper';

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
          keyboardEventListeners.forEach(eventListener =>
            eventListener.remove(),
          );
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
  const toast = useToast();
  const currentPosition = useRef({
    latitude: 0,
    longitude: 0,
  });
  const lastSentTime = useRef();
  const sumDistance = useRef(0);
  const lastLocation = useRef(null);

  // useEffect(()=>{
  //   const test = async()=>{
  //     const realm = await Realm.open(
  //       {
  //         path: 'otomedia',
  //         schema: [SpeedSchema, DistanceSchema]
  //       }
  //     )
  //     const distances = realm.objects('Distance')
  //     if (distances.length > 0) {
  //       const sums = sum(distances.map(item => item.distance))
  //       sumDistance.current = sums
  //       console.log("sums distance",sums);
  //     }
  //   }
  //   test()
  // },[])

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN).then(token => {
      if (token) {
        setisLogin(true);
      } else {
        setisLogin(false);
      }
    });

    initBackground();

    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task

      console.log('location', location);
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        onLocationChange(location);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(backround => {
      console.log('background', backround);
      if (JSON.parse(backround)) {
        BackgroundGeolocation.start();
      }
    });
  }, []);

  const onLocationChange = async location => {
    console.log('onLocationChange location data ', location);
    const distance = currentPosition?.current.latitude == 0 ? 0 : calcDistance(location.latitude,location.longitude,currentPosition?.current.latitude,currentPosition?.current.longitude);
    sumDistance.current += distance;
    const currentDistance = sumDistance.current.toFixed(2);
    console.log('currentDistance in MainTabScreen here ', currentDistance);
    const schema = [SpeedSchema, DistanceSchema];

    try {
      const realm = await Realm.open({
        path: 'otomedia',
        schema: schema,
      });
      realm.write(() => {
        realm.create('Speed', {
          date: Date(),
          speed: location.speed,
        });
        realm.create('Distance', {
          date: Date(),
          lat: location.latitude,
          lng: location.longitude,
          distance: distance,
        });
      });
    } catch (err) {
      console.log(err);
    }
    currentPosition.current = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    AsyncStorage.setItem(
      StorageKey.KEY_LAST_LOCATION,
      JSON.stringify(location),
    );
    // bisa coba masukin logic hit traffic API di sini memakai sumDistance.current (pindahin dari JobScreen)
    // open this line
    if (currentDistance >= 1) {
      console.log(
        '===== currenDistance >= 1 is true ===== ',
        currentDistance,
        currentDistance >= 1,
      );
      // check distance tidak boleh float
      console.log(
        '===== integer here =====',
        Number.isInteger(currentDistance),
      );
      if (Number.isInteger(currentDistance)) {
        // check distance multiple of 1
        if (currentDistance % currentDistance == 0) {
          console.log('~~~~~ get traffic flow API here ~~~~~');
          getTrafficFlow(location.latitude, location.longitude)
            .then(response => {
              console.log(
                'traffic tomtom data ',
                JSON.stringify(response.data, null, 2),
              );
              Alert.alert('Traffic data sent.');
            })
            .catch(err => {
              console.log('error here ', err);
            });
          // AsyncStorage.getItem(StorageKey.KEY_LAST_LOCATION)
          //   .then(res => {
          //     const value = JSON.parse(res);
          //     console.log('~~~~~ get traffic flow API here ~~~~~');
          //     getTrafficFlow(
          //       // value.latitude.toString(),
          //       // value.longitude.toString(),
          //       location.latitude,
          //       location.longitude,
          //     )
          //       .then(response => {
          //         console.log(
          //           'traffic tomtom data ',
          //           JSON.stringify(response.data, null, 2),
          //         );
          //       })
          //       .catch(err => {
          //         console.log('error here ', err);
          //       });
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });
        }
      }
    } else {
      console.log('currentDistance smaller than 1 ', currentDistance);
    }
    console.log('========= currenDistance end =======');

    //send location only every 5 METERS!!!. 
    //In order to achieve that, we can calculate the sums of the distance, if it's value modules to 5 we execute send location otherwise we skip it.
    // const sumDistanceInMeters = (sumDistance.current * 1000)
    // if (sumDistanceInMeters % 5 == 0){
      
    // }
    sendLocation(location);
  };

  const sendLocation = async location => {
    // if (!lastSentTime.current) {
    //   lastSentTime.current = moment(Date());
    //   return;
    // } else {
    //   const duration = moment
    //     .duration(lastSentTime.current.diff(moment(Date())))
    //     .asSeconds();

    //   console.log('momentDuration', duration);
    //   console.log('lastsenttime', lastSentTime);
    //   console.log('sumdistance', sumDistance.current);

    //   if (duration > Config.minimumTimeToSend) {
    //     return;
    //   }
    // }

    Realm.open({
      path: 'otomedia',
      schema: [SpeedSchema, DistanceSchema],
    }).then(realm => {
      const distances = realm.objects('Distance');
      if (distances.length > 0) {
        const sums = sum(distances.map(item => item.distance));
        console.log('total distance sums', sums);

        console.log('masuk traffic flow here ');
        console.log('location here for tomtom ', location);
        // getTrafficFlow(
        //   location.latitude.toString(),
        //   location.longitude.toString(),
        // )
        //   .then(response => {
        //     console.log(
        //       'traffic tomtom data ',
        //       JSON.stringify(response.data, null, 2),
        //     );
        //   })
        //   .catch(err => {
        //     console.log('error here ', err);
        //   });
        AsyncStorage.getItem(StorageKey.KEY_ACTIVE_CONTRACT).then(id => {
          const sumDistanceInMeters = (sums * 1000)
          if (sumDistanceInMeters % 5 != 0){
            return
          }
          sendDistance({
            lat: location.latitude,
            lng: location.longitude,
            distance: sumDistanceInMeters.toFixed(2), //in meter
            contract_id: id,
          })
            .then(response => {
              //sumDistance.current = 0
            })
            .catch(err => {});
        });
      }
    });
    //lastSentTime.current = moment(Date());
  };

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

*/

/*
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Alert, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LatoBold} from '../../../components/atoms/CustomText';
import Divider from '../../../components/atoms/Divider';
import NavBar from '../../../components/atoms/NavBar';
import Colors from '../../../constants/Colors';
import translate from '../../../locales/translate';

import IconStart from '../../../assets/images/ic_start.svg';
import IconStop from '../../../assets/images/ic_stop.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../../constants/StorageKey';
import {average, calcDistance, getRealm, sum} from '../../../actions/helper';
import speed, {DistanceSchema} from '../../../data/realm/speed';
import {SpeedSchema} from '../../../data/realm/speed';
import {getTrafficFlow, sendDistance} from '../../../services/contract';
import DistanceChart from '../../../components/atoms/DistanceChart';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import moment from 'moment';
import {makeMutable} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {reject} from 'lodash';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import InfoMenu from '../../../components/atoms/InfoMenu';
import {showDialog} from '../../../actions/commonActions';
import {showLocationAlwaysDialog} from '../../../actions/commonActions';

const JobScreen = ({navigation, route}) => {
  const [time, settime] = useState(['00', '00', '00']);
  const [speed, setSpeed] = useState('00');
  const [speedRaw, setSpeedRaw] = useState('00');
  const [distance, setDistance] = useState('00');
  const [isStart, setisStart] = useState();
  const loop = useRef();

  const currentPosition = useRef({
    latitude: 0,
    longitude: 0,
  });

  const {id} = route.params;

  const switchJob = () => {
    AsyncStorage.getItem(StorageKey.KEY_START_DATE).then(previousDate => {
      console.log('previous date', previousDate);
      console.log('today`s date', Date());
      if (previousDate) {
        const isCurrentDate = moment(previousDate).isSame(Date(), 'day');
        console.log('iscurrent', isCurrentDate);
        if (!isCurrentDate) {
          console.log('iscurrent reset');
          showDialog(
            translate('reset_dialog_title'),
            true,
            async () => {
              //oke
              await reset();
              AsyncStorage.setItem(
                StorageKey.KEY_DO_JOB,
                JSON.stringify(!isStart),
              );
              AsyncStorage.setItem(
                StorageKey.KEY_ACTIVE_CONTRACT,
                JSON.stringify(id),
              );

              if (!isStart) {
                checkGpsEnable();
              } else {
                setisStart(!isStart);
              }
            },
            () => {
              //tidak ok
              console.log('abort the task');
            },
            translate('start'),
            translate('cancel'),
            false,
            translate('reset_dialog_desc'),
          );
        } else {
          AsyncStorage.setItem(StorageKey.KEY_DO_JOB, JSON.stringify(!isStart));
          AsyncStorage.setItem(
            StorageKey.KEY_ACTIVE_CONTRACT,
            JSON.stringify(id),
          );

          if (!isStart) {
            console.log('start log gps');
            checkGpsEnable();
          } else {
            console.log('start log start');
            setisStart(!isStart);
          }
        }
      } else {
        console.log("previos null");
        AsyncStorage.setItem(StorageKey.KEY_DO_JOB, JSON.stringify(!isStart));
        AsyncStorage.setItem(
          StorageKey.KEY_ACTIVE_CONTRACT,
          JSON.stringify(id),
        );

        if (!isStart) {
          checkGpsEnable();
        } else {
          setisStart(!isStart);
        }
      }
    });
  };

  const requestAndroidLocationPermission = () => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      console.log('background permission', result);
      if (result == RESULTS.GRANTED) {
        if (Platform.Version < 29) {
          setisStart(true);
          return;
        } else {
          request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
            result => {
              console.log('background permission', result);
              if (result == RESULTS.GRANTED) {
                setisStart(true);
                return;
              }
            },
          );
        }
        return;
      }

      showOpenSetting();
    });
  };

  const checkBackroundLocation = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    console.log('result fine', result);
    if (result == RESULTS.DENIED) {
      showLocationAlwaysDialog(() => {
        requestAndroidLocationPermission();
      });
      return;
    }

    if (Platform.Version >= 29) {
      const result = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      console.log('result background', result);
      if (result == RESULTS.DENIED) {
        requestAndroidLocationPermission();
        return;
      }

      if (result == RESULTS.BLOCKED) {
        showOpenSetting();
        return;
      }
    }

    setisStart(true);
  };

  const checkGpsEnable = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        checkBackroundLocation();
      })
      .catch(err => {});
  };

  const showOpenSetting = () => {
    showDialog(
      translate('please_allow_location_always'),
      false,
      openSettings,
      () => navigation.pop(),
      translate('open_setting'),
      null,
      false,
    );
  };

  const reset = () =>
    new Promise(async (resolve, reject) => {
      settime(['00', '00', '00']);
      setSpeed('00');
      setSpeedRaw('00');
      setDistance('00');

      const schema = [SpeedSchema, DistanceSchema];

      const realm = await Realm.open({
        path: 'otomedia',
        schema: schema,
      });

      realm.write(() => realm.deleteAll());
      await AsyncStorage.removeItem(StorageKey.KEY_START_TIME);
      await AsyncStorage.removeItem(StorageKey.KEY_ELAPSED_TIME);
      resolve(true);
    });

  const onLocationChange = async () => {
    console.log("on location change in jobscreen");
    const schema = [SpeedSchema, DistanceSchema];
    const realm = await Realm.open({
      path: 'otomedia',
      schema: schema,
    });

    const speeds = realm.objects('Speed');
    print(`ini speed ${speeds}`);
    if (speeds.length > 0) {
      const averageSpeed = average(speeds.map(item => item.speed));
      const kmh = averageSpeed * 3.6;
      setSpeed(averageSpeed.toFixed(2));
      setSpeedRaw(kmh.toFixed(2));
    }

    const distances = realm.objects('Distance');
    if (distances.length > 0) {
      const sumDistance = sum(distances.map(item => item.distance));
      setDistance(sumDistance.toFixed(2));

      // check if distance is >= 1
      // const currentDistance = sumDistance.toFixed(2);
      // console.log('===== currentDistance here =====', sumDistance.toFixed(2));
      // if (currentDistance >= 1) {
      //   console.log(
      //     '===== currenDistance >= 1 is true ===== ',
      //     currentDistance,
      //     currentDistance >= 1,
      //   );
      //   // check distance tidak boleh float
      //   console.log(
      //     '===== integer here =====',
      //     Number.isInteger(currentDistance),
      //   );
      //   if (Number.isInteger(currentDistance)) {
      //     // check distance multiple of 1
      //     if (currentDistance % currentDistance == 0) {
      //       AsyncStorage.getItem(StorageKey.KEY_LAST_LOCATION)
      //         .then(res => {
      //           const value = JSON.parse(res);
      //           console.log('~~~~~ get traffic flow API here ~~~~~');
      //           getTrafficFlow(
      //             value.latitude.toString(),
      //             value.longitude.toString(),
      //           )
      //             .then(response => {
      //               console.log(
      //                 'traffic tomtom data ',
      //                 JSON.stringify(response.data, null, 2),
      //               );
      //             })
      //             .catch(err => {
      //               console.log('error here ', err);
      //             });
      //         })
      //         .catch(err => {
      //           console.log(err);
      //         });
      //     }
      //   }
      // } else {
      //   console.log('currentDistance smaller than 1 ', currentDistance);
      // }
      // console.log('========= currenDistance end =======');
    }
    // check distance >= 1
    // console.log(
    //   '====================== distance here =================== ',
    //   distance,
    // );
    // if (distance >= 0.1) {
    //   console.log(
    //     '========================== masuk lebih dari 0.1 =============== ',
    //     distance,
    //     distance >= 0.1,
    //   );
    //   // check distance tidak boleh float
    //   console.log(
    //     '========================== integer here ===================',
    //     Number.isInteger(distance),
    //   );
    //   if (Number.isInteger(distance)) {
    //     // check distance multiple of 1
    //     if (distance % distance == 0) {
    //       console.log(
    //         '=========================== per 1 km =============================',
    //         distance,
    //         distance % distance == 0,
    //       );
    //     }
    //   }
    // }
  };

  const startTimer = async time => {
    const diff = await getElapsedSecond(time);
    showFormattedElapsedTime(diff);
    loop.current = setInterval(async () => {
      const diff = await getElapsedSecond(time);
      showFormattedElapsedTime(diff);
    }, 1000);
  };

  const showFormattedElapsedTime = diff => {
    const elapsedTime = moment()
      .startOf('day')
      .seconds(diff)
      .format('HH:mm:ss');
    settime(elapsedTime.split(':'));
  };

  //get elapsed time in second since the start time
  //if there is previous recorded time add it to current time
  const getElapsedSecond = async startTime =>
    new Promise(async (resolve, reject) => {
      const previousElapsedTime = await AsyncStorage.getItem(
        StorageKey.KEY_ELAPSED_TIME,
      );
      const momentStartTime = moment(startTime);
      const now = moment(Date());
      var diff;
      if (previousElapsedTime) {
        diff =
          moment.duration(now.diff(momentStartTime)).asSeconds() +
          parseInt(previousElapsedTime);
      } else {
        diff = moment.duration(now.diff(momentStartTime)).asSeconds();
      }
      resolve(diff);
    });

  //if date is different on last start date reset the time
  const checkDateIsDifferent = async () => {
    // const previousDate = await AsyncStorage.getItem(StorageKey.KEY_START_DATE)
    // console.log('previous date', previousDate)
    // console.log('today`s date', Date())
    // if (previousDate) {
    //   const isCurrentDate = moment(previousDate).isSame(Date(), 'day')
    //   console.log('iscurrent', isCurrentDate)
    //   if (!isCurrentDate) {
    //     await reset()
    //   }
    // }

    AsyncStorage.setItem(StorageKey.KEY_START_DATE, moment(Date()).toString());

    checkStartTime();
    // AsyncStorage.getItem(StorageKey.KEY_START_DATE).then(previousDate => {
    //   console.log('previous date', previousDate)
    //   console.log('today`s date', Date())

    //   if (previousDate) {
    //     const isCurrentDate = moment(previousDate).isSame(Date(), 'day')
    //     console.log('iscurrent', isCurrentDate)
    //     if (!isCurrentDate) {
    //       console.log('iscurrent reset')
    //       showDialog(translate("reset_dialog_title"), true, async () => {
    //         await reset()
    //         AsyncStorage.setItem(StorageKey.KEY_START_DATE, moment(Date()).toString())
    //         checkStartTime()
    //       }, ()=>{
    //         AsyncStorage.setItem(StorageKey.KEY_DO_JOB, JSON.stringify(false))
    //         setisStart(false)
    //       }, translate("start"), translate("cancel"), false, translate("reset_dialog_desc"))
    //     } else {
    //       AsyncStorage.setItem(StorageKey.KEY_START_DATE, moment(Date()).toString())
    //       checkStartTime()
    //     }
    //   } else {
    //     AsyncStorage.setItem(StorageKey.KEY_START_DATE, moment(Date()).toString())
    //     checkStartTime()
    //   }

    // })
  };

  //if there is previous time start the timer with the previous time
  //else start the timer with current date
  const checkStartTime = async () => {
    var startTime = await AsyncStorage.getItem(StorageKey.KEY_START_TIME);
    if (startTime) {
      startTimer(startTime);
      return;
    }

    AsyncStorage.setItem(StorageKey.KEY_START_TIME, Date()).then(
      startTimer(Date()),
    );
  };

  const startBackgroundLocation = () => {
    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(background => {
      console.log(background);
      if (!JSON.parse(background)) {
        BackgroundGeolocation.start();
        AsyncStorage.setItem(
          StorageKey.KEY_BACKGROUND_ACTIVE,
          JSON.stringify(true),
        );
      }
    });
  };

  const stopBackgroundLocation = () => {
    AsyncStorage.getItem(StorageKey.KEY_BACKGROUND_ACTIVE).then(background => {
      if (background) {
        BackgroundGeolocation.stop();
        AsyncStorage.setItem(
          StorageKey.KEY_BACKGROUND_ACTIVE,
          JSON.stringify(false),
        );
      }
    });
  };

  const saveElapsedTime = async () => {
    var startTime = await AsyncStorage.getItem(StorageKey.KEY_START_TIME);
    getElapsedSecond(startTime).then(elapsedTime => {
      if (!elapsedTime) {
        return;
      }
      AsyncStorage.setItem(StorageKey.KEY_ELAPSED_TIME, elapsedTime.toString());
    });
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(StorageKey.KEY_DO_JOB).then(job => {
        const isDoingJob = JSON.parse(job);

        console.log('is doing job', isDoingJob);
        if (!isDoingJob) {
          getLastElapsedSecond().then(second => {
            showFormattedElapsedTime(second);
          });
        }

        setisStart(isDoingJob);
      });

      onLocationChange();

      BackgroundGeolocation.on('location', location => {
        // start background task here
        onLocationChange();
        // BackgroundGeolocation.startTask(taskKey => {
        //   console.log('~~~~~ Background task in JobScreen on ~~~~~');
        //   onLocationChange();
        //   BackgroundGeolocation.endTask(taskKey);
        // });
      });

      return () => {
        clearInterval(loop.current);
        console.log('cleaning');
      };
    }, []),
  );

  const getLastElapsedSecond = () =>
    new Promise(async (resolve, reject) => {
      const elapsedSecond = await AsyncStorage.getItem(
        StorageKey.KEY_ELAPSED_TIME,
      );
      if (elapsedSecond) {
        resolve(elapsedSecond);
      }
      resolve(0);
    });

  useFocusEffect(
    useCallback(() => {
      if (isStart == undefined) {
        console.log('start is undefined');
        return;
      }

      if (isStart) {
        startBackgroundLocation();
        checkDateIsDifferent();
      } else {
        stopBackgroundLocation();
        saveElapsedTime();
        AsyncStorage.removeItem(StorageKey.KEY_START_TIME).then(() =>
          clearInterval(loop),
        );
      }

      return () => {
        clearInterval(loop.current);
        console.log('cleaning');
      };
    }, [isStart]),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar title={translate('do_job')} navigation={navigation} />
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
          }}>
          <LatoBold style={{fontSize: 18}}>{translate('time')}</LatoBold>
          <View style={{flexDirection: 'row', padding: 10}}>
            <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>
              {time[0]}
            </LatoBold>
            <LatoBold containerStyle={{padding: 5}} style={{fontSize: 38}}>
              :
            </LatoBold>
            <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>
              {time[1]}
            </LatoBold>
            <LatoBold containerStyle={{padding: 5}} style={{fontSize: 38}}>
              :
            </LatoBold>
            <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>
              {time[2]}
            </LatoBold>
          </View>
        </View>

        <Divider />

        <View
          style={{
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 3,
          }}>
          <LatoBold style={{fontSize: 18}}>
            {translate('average_speed')}
          </LatoBold>
          <LatoBold style={{fontSize: 48, marginTop: 24}}>{speedRaw}</LatoBold>
          <LatoBold style={{fontSize: 18}}>Km/h</LatoBold>
        </View>

        <Divider />

        <View
          style={{
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 3,
          }}>
          <LatoBold style={{fontSize: 18}}>{translate('distance')}</LatoBold>
          <LatoBold style={{fontSize: 48, marginTop: 24}}>{distance}</LatoBold>
          <LatoBold style={{fontSize: 18}}>Km</LatoBold>
        </View>

        <InfoMenu
          containerStyle={{marginHorizontal: 16}}
          text={translate('reset_job_warning')}
        />
        <Button
          title={translate(isStart ? 'stop' : 'start')}
          style={{padding: 24, width: 180, alignSelf: 'center'}}
          containerStyle={{width: 180, padding: 24, alignSelf: 'center'}}
          buttonStyle={{
            borderRadius: 25,
            height: 50,
            backgroundColor: isStart ? 'red' : Colors.primarySecondary,
          }}
          iconPosition={'left'}
          titleStyle={{padding: 5}}
          icon={!isStart ? IconStart : IconStop}
          onPress={switchJob}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  time: {
    backgroundColor: Colors.divider,
    padding: 5,
    borderRadius: 10,
  },
});

export default JobScreen;

*/