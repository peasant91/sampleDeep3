import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Colors from '../../constants/Colors';
import {LatoBold} from '../atoms/CustomText';

const AccountMenu = ({Icon, text, onPress, containerStyle, tintColor}) => {
  return (
    <View style={containerStyle}>
      <Shadow viewStyle={{width: '100%', backgroundColor: 'white', borderRadius: 8}} radius={8} distance={3} offset={[0,2]} startColor={Colors.divider} containerViewStyle={{backgroundColor: 'white'}} >
    <TouchableOpacity onPress={onPress} >
      <View style={styles.container}>
        <LatoBold Icon={Icon} style={{color: tintColor ?? Colors.primary}} iconTint={tintColor}>{text}</LatoBold>
      </View>
    </TouchableOpacity>
      </Shadow>
    </View>
  );
};

export default AccountMenu;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 10
  },
});
