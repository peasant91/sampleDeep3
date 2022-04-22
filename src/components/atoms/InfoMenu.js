import React from 'react';
import {View} from 'react-native';

import IconInfo from '../../assets/images/ic_home_info.svg';
import { LatoRegular } from './CustomText';

const InfoMenu = ({text, containerStyle}) => {
  return (
    <View
      style={[{
        backgroundColor: '#F5F6FF',
        borderRadius: 5,
        flexDirection: 'row',
        flex: 1
      }, containerStyle]}>
      <IconInfo />
      <LatoRegular style={{paddingVertical: 10, marginLeft: 16, paddingRight: 20, width: '95%', fontSize: 12}}>
        {text}
      </LatoRegular>
    </View>
  );
};

export default InfoMenu;
