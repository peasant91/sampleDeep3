import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../constants/Colors';
import {LatoBold} from '../atoms/CustomText';

const AccountMenu = ({Icon, text, onPress, containerStyle, tintColor}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={styles.container}>
        <LatoBold Icon={Icon} style={{color: tintColor ?? Colors.primary}} iconTint={tintColor}>{text}</LatoBold>
      </View>
    </TouchableOpacity>
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
