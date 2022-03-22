/* eslint-disable prettier/prettier */
import React, { ReactChild, ReactChildren, ReactNode } from 'react';
import {StyleSheet, ViewStyle, Text, TextStyle, StyleProp, View} from 'react-native';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';


export const LatoRegular = ({children, style, numOfLines, Icon, containerStyle}) => {
  return (
      <View style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
        {Icon ? <Icon style={{paddingRight: 10}}/> : null}
      <Text ellipsizeMode='tail' numberOfLines={numOfLines} style={[{fontFamily: 'Lato-Regular', color: Colors.primaryText, fontSize: 14, paddingLeft: Icon ? 5 : 0}, style]}>{children}</Text>
      </View>
  );
};

export const LatoBold = ({children, style, numOfLines, Icon, containerStyle, iconTint}) => {
  return (
      <View style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
        {Icon ? <Icon style={{paddingRight: 10, color: iconTint}}/> : null}
      <Text ellipsizeMode='tail' numberOfLines={numOfLines} style={[{fontFamily: 'Lato-Bold', color: Colors.primaryText, fontSize: 14, paddingLeft: Icon ? 5 : 0}, style]}>{children}</Text>
      </View>
  );
};

export const MainTitle = ({children, style = {}, numOfLines}) => {
  return (
      <Text style={[{fontFamily: 'Raleway-Bold', color: Colors.primaryText, fontSize: 18}, style]}>{children}</Text>
  );
};

export const RobotoRegular = ({children, style = {}, numOfLines}) => {
  return (
      <Text style={[{fontFamily: 'Roboto-Regular', color: Colors.primaryText, fontSize: 14}, style]}>{children}</Text>
  );
};

export const RobotoBold = ({children, style = {}, numOfLines}) => {
  return (
      <Text style={[{fontFamily: 'Roboto-Bold', color: Colors.primaryText, fontSize: 14}, style]}>{children}</Text>
  );
};


