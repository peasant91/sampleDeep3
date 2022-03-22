import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import {useFocusEffect} from '@react-navigation/native';
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




import {Image} from 'react-native-elements';
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText';
import Divider from '../../components/atoms/Divider';
import CardContract from '../../components/atoms/CardContract';
import HomeLineChart from '../../components/atoms/HomeLineChart';
import InfoMenu from '../../components/atoms/InfoMenu';

  const dummyContractData = {
    imageUrl: 'https://statik.tempo.co/?id=836405&width=650',
    contractTitle: 'Full Body',
    bankName: 'PT Bank Mega',
    address: 'Prov. Jawa Tengah',
    date: '31 Nov 2022',
  }

const HomeScreen = ({navigation, route}) => {
  const [backPressedCount, setBackPressedCount] = useState(0);
  const [isNotifVisible, setisNotifVisible] = useState(true);

  var isEmpty = false

  const data = {
    imageUrl:
      'https://static.republika.co.id/uploads/member/images/news/avwkgphlic.jpg',
    name: 'Vladimir Putin',
    car: 'Honda Arv',
    licensePlate: 'A 8 UD',
    isVerified: true,
  };


  useEffect(() => {
    if (backPressedCount === 2) {
      BackHandler.exitApp();
    }
  }, [backPressedCount]);

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
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />

        <View style={styles.topContainer}>
          <IconTop />
          <View style={{position: 'absolute', right: 24, top: 24}}>
            <IconBell />
            <IconNotif
              style={[
                styles.redNotif,
                {display: isNotifVisible ? 'flex' : 'none'},
              ]}
            />
          </View>
        </View>

        <ScrollView>

          <View>
            <View style={styles.header}>
              <View style={{flexDirection: 'row'}}>

                <Image source={{uri: data.imageUrl}} style={styles.topImage} />

                <View style={{marginLeft: 16, justifyContent: 'space-between', paddingVertical: 4}}>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconLock/>
                    <LatoRegular style={{marginHorizontal: 5}}>{data.name}</LatoRegular>
                    <IconVerified/>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconCar/>
                    <LatoRegular style={{marginHorizontal: 5}}>{data.car + '-' + data.licensePlate}</LatoRegular>
                  </View>

                </View>

              </View>

              <InfoMenu containerStyle={{marginTop: 16}} text={translate('home_info')}/>

              <CustomButton
                style={{marginTop: 16}}
                types={'primary'}
                title={translate('do_job')}
                iconRight={true}
                icon={IconArrow}
              />

            </View>

            <Divider/>

            <View>

              <LatoBold Icon={IconActiveContract} style={{color: Colors.primary}} containerStyle={{paddingHorizontal: 16, paddingTop: 16}}>{translate('active_contract')}</LatoBold>

              {
                isEmpty ? 
                <View >
                  <Image source={require('../../assets/images/ic_car_empty.png')} style={{width: '100%', height: undefined, aspectRatio: 2.8}} resizeMode={'cover'}/>
                  <LatoRegular containerStyle={{paddingHorizontal: 60, paddingVertical: 16}} style={{textAlign: 'center'}}>{translate('no_active_contract')}</LatoRegular>
                  <CustomButton title={translate('see_offer').toUpperCase()} types='primary' containerStyle={{paddingHorizontal: 16}}/>
                </View> : 
                <View style={{padding: 16}}>
                  <CardContract data={dummyContractData}/>
                  <LatoBold Icon={IconActiveContract} style={{color: Colors.primary}} containerStyle={{paddingVertical: 16}}>{translate('travel_report')}</LatoBold>
                  <HomeLineChart/>
                </View>
              }

            </View>
          </View>

        </ScrollView>

      </SafeAreaView>
    </>
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
