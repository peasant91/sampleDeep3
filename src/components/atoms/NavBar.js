import React from 'react';
import BackButton from '../../assets/images/ic_arrow_back.svg';
import {LatoBold } from './CustomText';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Colors from '../../constants/Colors';

const NavBar = ({navigation, title, style, shadowEnabled, RightView, onBackPress}) => {
  return (
    <Shadow distance={10} startColor={shadowEnabled ? Colors.divider : 'white'} offset={[0,5]}>

    <View
      style={[
        {flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', width: '100%', zIndex: 0},
        style, shadowEnabled ? styles.bottomShadow : null
      ]}>
      <TouchableOpacity style={{flex: 1}} onPress={ !onBackPress ? () => navigation.pop() : () => onBackPress()}>
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
    </Shadow>
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
