import React, { useEffect } from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../constants/Colors';
import {LatoBold} from './CustomText';

import IconArrowRight from '../../assets/images/ic_arrow_right_id.svg';
import IconIDCard from '../../assets/images/ic_id_card.svg';
import IconView from '../../assets/images/ic_image_view.svg';

import {Image} from 'react-native-elements';
import translate from '../../locales/translate';
import { getFullLink } from '../../actions/helper';

const borderRadius = 8;

const IDCard = ({navigation, title, onPress, imageUri, required, isCheck}) => {

  useEffect(() => {
    console.log('image id card',imageUri)
  }, [])
  

  return (
    <View>
      <View style={styles.container}>
        {imageUri ? (
          <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('ImageViewer', {imageUrl: imageUri, title: title})}>
            <Image
              source={{uri: imageUri.includes('/storage/driver') ? getFullLink(imageUri) : imageUri}}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'cover',
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
              }}
            />
            <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
            <IconView/>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPress} style={styles.idContainer}>
            <View style={styles.idContainer}>
              <IconIDCard />
              <LatoBold style={{color: Colors.primary}}>
                {translate('take_picture', {string: title})}
                {required && <LatoBold style={{color: 'red'}}>*</LatoBold>}
              </LatoBold>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onPress} style={styles.rightArrowContainer}>
          <View>
            <IconArrowRight />
          </View>
        </TouchableOpacity>
      </View>
      {isCheck && required && !imageUri && (
        <LatoBold style={{color: 'red', marginTop: 10}}>
          {translate('please_take_picture', {string: title})}
        </LatoBold>
      )}
    </View>
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
