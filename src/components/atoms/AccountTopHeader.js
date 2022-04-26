import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { LatoRegular } from './CustomText';

import IconVerified from '../../assets/images/ic_home_verified.svg';
import IconLock from '../../assets/images/ic_lock.svg';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import { getFullLink, isEmpty } from '../../actions/helper';
import { ShimmerAccoutTopHeader } from './shimmer/Shimmer';
import { Shadow } from 'react-native-shadow-2';

const AccountTopHeader = ({ data, isLoading }) => {

  useEffect(() => {
    console.log(data)
  
  }, [])
  

  return (
          <Shadow viewStyle={{width: '100%', padding: 10}} distance={5}>

      {!isLoading ?
        <View style={{flexDirection: 'row'}}>
          <Avatar 
            rounded
            size={'medium'}
            source={{ uri: getFullLink(data.profile_image) }} />
          <View
            style={{
              marginLeft: 10,
              paddingVertical: 4,
              justifyContent: 'space-around',
            }}>
            <LatoRegular Icon={IconLock}>{data.name}</LatoRegular>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconVerified
                color={data.status != 'waiting' ? Colors.secondary : Colors.grey}
              />
              <LatoRegular
                style={{
                  color: data.status != 'waiting' ? Colors.secondary : Colors.grey,
                  marginLeft: 5,
                }}>
                {translate(data.status != 'waiting' ? 'verified' : 'on_verifying')}
              </LatoRegular>
            </View>
          </View>
          </View>
        : <ShimmerAccoutTopHeader />}
          </Shadow>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: 'white',

    elevation: 2,
    flexDirection: 'row',
  },
  image: {
    width: 48,
    height: 48,
  },
});

export default AccountTopHeader;
