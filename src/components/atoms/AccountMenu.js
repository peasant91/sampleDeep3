import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Colors from '../../constants/Colors';
import {LatoBold} from '../atoms/CustomText';

const AccountMenu = ({Icon, text, onPress, containerStyle, tintColor}) => {
  return (
    <View style={containerStyle}>
    <View style={styles.container}>
    <TouchableOpacity onPress={onPress} >
        <LatoBold Icon={Icon} style={{color: tintColor ?? Colors.primary}} iconTint={tintColor}>{text}</LatoBold>
    </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountMenu;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5
  },
});
