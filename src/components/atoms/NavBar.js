import React from 'react';
import BackButton from '../../assets/images/ic_arrow_back.svg';
import {LatoBold } from './CustomText';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';

const NavBar = ({navigation, title, style, shadowEnabled, RightView}) => {
  return (
    <View
      style={[
        {flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', width: '100%', zIndex: 0},
        style, shadowEnabled ? styles.bottomShadow : null
      ]}>
      <TouchableOpacity style={{flex: 1}} onPress={() => navigation.pop()}>
        <BackButton />
      </TouchableOpacity>
      {title ? (
        <View style={{alignItems: 'center', flex: 10 }}>
          <LatoBold style={{fontSize: 20, marginLeft: 10, }}>{title}</LatoBold>
        </View>
      ) : (
        <View />
      )}
      <View style={{flex: 1}}>

      {RightView}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5.84,

    elevation: 5,
  },
});

export default NavBar;
