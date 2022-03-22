import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Image} from 'react-native-elements';
import {LatoRegular} from './CustomText';

import IconVerified from '../../assets/images/ic_home_verified.svg';
import IconLock from '../../assets/images/ic_lock.svg';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';

const AccountTopHeader = ({data}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: data.imageUrl}} style={styles.image} />
      <View
        style={{
          marginLeft: 10,
          paddingVertical: 4,
          justifyContent: 'space-around',
        }}>
        <LatoRegular Icon={IconLock}>{data.name}</LatoRegular>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconVerified
            color={data.isVerified ? Colors.secondary : Colors.grey}
          />
          <LatoRegular
            style={{
              color: data.isVerified ? Colors.secondary : Colors.grey,
              marginLeft: 5,
            }}>
            {translate(data.isVerified ? 'verified' : 'on_verifying')}
          </LatoRegular>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    borderRadius: 48,
  },
});

export default AccountTopHeader;
