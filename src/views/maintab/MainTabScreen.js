import React, {useContext, useState, useEffect} from 'react';
import {View, Platform} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';
import OfferScreen from './offer/OfferScreen';
import AccountScreen from './AccountScreen';

import IconHome from '../../assets/images/ic_home.svg';
import IconOffer from '../../assets/images/ic_offer.svg';
import IconAccount from '../../assets/images/ic_account.svg';
import Colors from '../../constants/Colors';
import {AuthContext} from '../../../App';
import StorageKey from '../../constants/StorageKey';

const Tab = createBottomTabNavigator();

const MainTabScreen = ({navigation, route}) => {
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN).then(token => {
      if (token) {
        setisLogin(true);
      } else {
        setisLogin(false);
      }
    });
  }, []);

  return (
    <Tab.Navigator
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
