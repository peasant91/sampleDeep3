import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../constants/Colors';
import {LatoBold} from './CustomText';

import IconArrowRight from '../../assets/images/ic_arrow_right_id.svg';
import IconIDCard from '../../assets/images/ic_id_card.svg';
import { Image } from 'react-native-elements';

const borderRadius = 8;

const IDCard = ({title, onPress, imageUri}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {imageUri ? 
      <View>
        <Image source={{uri: imageUri}} style={{width: '100%', height: undefined, aspectRatio: 1.5, resizeMode: 'cover'}}/>
      </View>
      : 
      <View style={styles.container}>
        <View style={styles.idContainer}>
          <IconIDCard />
          <LatoBold style={{color: Colors.primary}}>{title}</LatoBold>
        </View>
        <View style={styles.rightArrowContainer}>
          <IconArrowRight />
        </View>
      </View>
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
