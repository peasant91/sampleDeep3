/* eslint-disable prettier/prettier */

import {TouchableOpacity} from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';

const CustomButton = ({
  containerStyle,
  icon,
  iconRight = false,
  types,
  title,
  onPress,
  style,
  isLoading = false,
}) => {
  return (
    <View style={[containerStyle, {borderRadius: 24}]} >
      <TouchableOpacity >
        <View >
          <Button
            title={title.toUpperCase()}
            style={style}
            pointer
            onPress={onPress}
            disabled={isLoading}
            loading={isLoading}
            iconContainerStyle={{marginRight: 10, paddingRight: 10, width: 2}}
            icon={icon ? icon : null}
            iconContainerStyle={{marginLeft: 10, paddingLeft: 10}}
            iconRight={iconRight}
            disabledTitleStyle={{...styles.disbledTitle}}
            disabledStyle={{...styles.buttonDisabled}}
            buttonStyle={[
              types == 'primary' ? styles.primary : styles.secondary,
              style,
            ]}
            titleStyle={
              types == 'primary' ? styles.titlePrimary : styles.titleSecondary
            }
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  primary: {
    borderRadius: 24,
    borderWidth: 1,
    height: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingRight: 10,
  },
  secondary: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 50,
    backgroundColor: 'white',
  },
  buttonDisabled: {
    borderRadius: 24,
    borderWidth: 1,
    height: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingRight: 10,
  },
  titlePrimary: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginHorizontal: 10,
  },
  titleSecondary: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    color: Colors.primary,
  },
  disbledTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: 'white',
  },
});

export default CustomButton;
