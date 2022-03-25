import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../constants/Colors';
import {LatoBold} from './CustomText';

import IconArrowRight from '../../assets/images/ic_arrow_right_id.svg';
import IconIDCard from '../../assets/images/ic_id_card.svg';
import { Image } from 'react-native-elements';
import translate from '../../locales/translate';

const borderRadius = 8;

const IDCard = ({title, onPress, imageUri, required, isCheck}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {imageUri ?

      <View style={{flex: 1}}>
        <Image source={{uri: imageUri}} style={{height: '100%', width: '100%', resizeMode: 'cover', borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius}}/>
      </View> :
        <View style={styles.idContainer}>
          <IconIDCard />
          <LatoBold style={{color: Colors.primary}}>{translate('take_picture', {string: title})}{required && <LatoBold style={{color: 'red'}}>*</LatoBold>}</LatoBold>
        </View>
}
        <View style={styles.rightArrowContainer}>
          <IconArrowRight />
        </View>
      </View>
      {
        isCheck && required && !imageUri && <LatoBold style={{color: 'red', marginTop: 10}}>{translate('please_take_picture', {string: title})}</LatoBold>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    height: 150,
  },
  idContainer: {
    backgroundColor: '#F5F6FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  rightArrowContainer: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
});

export default IDCard;
