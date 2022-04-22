import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../components/atoms/CustomButton';
import {
  LineChart,
} from "react-native-chart-kit";

//icon
import IconTop from '../../assets/images/ic_home_top.svg';
import IconBell from '../../assets/images/ic_home_bell.svg';
import IconNotif from '../../assets/images/ic_home_notif_red.svg';
import IconLock from '../../assets/images/ic_lock.svg';
import IconVerified from '../../assets/images/ic_home_verified.svg';
import IconCar from '../../assets/images/ic_home_car.svg';
import IconArrow from '../../assets/images/ic_arrow_right_white.svg';
import IconActiveContract from '../../assets/images/ic_home_active_contract.svg';
import IconReport from '../../assets/images/ic_home_report.svg';
import IconCarEmpty from '../../assets/images/ic_car_empty.svg';




import { Image } from 'react-native-elements';
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText';
import Divider from '../../components/atoms/Divider';
import HomeLineChart from '../../components/atoms/HomeLineChart';
import InfoMenu from '../../components/atoms/InfoMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardContract from '../../components/atoms/list/CardContract';
import { getHome } from '../../services/home';
import { showDialog } from '../../actions/commonActions';
import { getProfile } from '../../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import { getFullLink, isEmpty } from '../../actions/helper';
import { ShimmerCardContract, ShimmerHomeBody, ShimmerHomeProfile } from '../../components/atoms/shimmer/Shimmer';
import axios from 'axios';
import ErrorNotRegisterVehicle from '../../components/atoms/ErrorNotRegisterVehicle';

const dummyContractData = {
  imageUrl: 'https://statik.tempo.co/?id=836405&width=650',
  contractTitle: 'Full Body',
  bankName: 'PT Bank Mega',
  address: 'Prov. Jawa Tengah',
  date: '31 Nov 2022',
}

const HomeScreen = ({ navigation, route }) => {

  const [backPressedCount, setBackPressedCount] = useState(0);
  const [isNotifVisible, setisNotifVisible] = useState(true);
  const [isLoading, setisLoading] = useState(true)
  const [homeData, sethomeData] = useState({})
  const [profileData, setprofileData] = useState({})


  const data = {
    imageUrl:
      'https://static.republika.co.id/uploads/member/images/news/avwkgphlic.jpg',
    name: 'Vladimir Putin',
    car: 'Honda Arv',
    licensePlate: 'A 8 UD',
    isVerified: true,
  };

  const goToOffer = () => {
    navigation.navigate('Offer')
  }

  const goToContractDetail = () => {
    navigation.navigate('CurrentContract', {id: homeData.active_contract.contract_id, isEmpty: false})
  }

  const getHomeData = () => {
    setisLoading(true)

    AsyncStorage.getItem(StorageKey.KEY_USER_PROFILE).then(data => {
      if (data) {
        setprofileData(JSON.parse(data))
      }
    })

    axios.all([
      getHome(),
      getProfile()
    ]).then(axios.spread(async (home, profile) => {
      setisLoading(false)
      sethomeData(home)
      AsyncStorage.setItem(StorageKey.KEY_USER_PROFILE, JSON.stringify(profile))
      setprofileData(profile)
    })).catch(err => {
      setisLoading(false)
      showDialog(err.message)
    })
  }

  useEffect(() => {
    if (backPressedCount === 2) {
      BackHandler.exitApp();
    }
  }, [backPressedCount]);

  useEffect(() => {
    getHomeData()
  }, [route?.params])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setBackPressedCount(backPressedCount => backPressedCount + 1);
        setTimeout(() => setBackPressedCount(0), 1000);
        toast.show(translate('press_again'), {
          type: 'custom',
          placement: 'bottom',
          duration: 1000,
          offset: 30,
          animationType: 'slide-in',
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <StatusBar backgroundColor={'white'} barStyle="dark-content" />

      <View style={styles.topContainer}>
        <IconTop />
        <TouchableOpacity style={{ position: 'absolute', right: 24, top: 24 }} onPress={() => navigation.navigate('Notification')}>
          <IconBell />
          <IconNotif
            style={[
              styles.redNotif,
              { display: isNotifVisible ? 'flex' : 'none' },
            ]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={getHomeData}
        />}
      >

        <View>

          <View style={styles.header}>

            {isLoading ? <ShimmerHomeProfile /> :

              <View style={{ flexDirection: 'row' }}>

                <Image source={{ uri: getFullLink(profileData.profile_image) }} style={styles.topImage} />

                <View style={{ marginLeft: 16, justifyContent: 'space-between', paddingVertical: 4 }}>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconLock />
                    <LatoRegular style={{ marginHorizontal: 5 }}>{profileData.name}</LatoRegular>
                    <IconVerified style={{ color: homeData.status == 'verified' ? Colors.primarySecondary : Colors.grey }} />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconCar />
                    <LatoRegular style={{ marginHorizontal: 5 }}>{homeData.vehicle?.brand + ' -   ' + homeData.vehicle?.vehicle_plate}</LatoRegular>
                    <IconVerified style={{ color: homeData.vehicle_status == 'verified' ? Colors.primarySecondary : Colors.grey }} />
                  </View>

                </View>

              </View>
            }
          </View>

          <InfoMenu containerStyle={{ marginHorizontal: 16, marginBottom: 16 }} text={translate('home_info')} />

          {isLoading ? <ShimmerHomeBody containerStyle={{ margin: 16 }} /> :

            <View>

              {homeData.active_contract &&
                <CustomButton
                  style={{ marginHorizontal: 8 }}
                  types={'primary'}
                  title={translate('do_job')}
                  iconRight={true}
                  icon={IconArrow}
                  onPress={() => navigation.navigate('Job')}
                />
              }

              <Divider style={{ marginBottom: 16 }} />

              <View>

                {
                  homeData.vehicle == null ?
                    //vehicle not registered
                    <ErrorNotRegisterVehicle containerStyle={{ marginTop: 32 }} />
                    :
                    (homeData.active_contract ?
                      //contract is active
                      <View>
                        <LatoBold Icon={IconActiveContract} style={{ color: Colors.primary }} containerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}>{translate('active_contract')}</LatoBold>
                        <View style={{ padding: 16 }}>
                          <CardContract data={homeData.active_contract} onPress={goToContractDetail} />
                          <LatoBold Icon={IconActiveContract} style={{ color: Colors.primary }} containerStyle={{ paddingVertical: 16 }}>{translate('travel_report')}</LatoBold>
                          <HomeLineChart />
                        </View>
                      </View>
                      :
                      //registered but no offer
                      <View>
                        <LatoBold Icon={IconActiveContract} style={{ color: Colors.primary }} containerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}>{translate('active_contract')}</LatoBold>
                        <View style={{ paddingVertical: 32 }}>
                          <Image source={require('../../assets/images/ic_car_empty.png')} style={{ width: '100%', height: undefined, aspectRatio: 2.8 }} resizeMode={'cover'} />
                          <LatoRegular containerStyle={{ paddingHorizontal: 60, paddingVertical: 16 }} style={{ textAlign: 'center' }}>{translate('no_active_contract')}</LatoRegular>
                          <CustomButton title={translate('see_offer').toUpperCase()} types='primary' containerStyle={{ paddingHorizontal: 16 }} onPress={goToOffer} />
                        </View>
                      </View>
                    )
                }

              </View>

            </View>
          }
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  redNotif: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  topContainer: {
    padding: 16,
    alignItems: 'center',
  },
  topImage: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  header: {
    padding: 16,
  },

});

export default HomeScreen;
