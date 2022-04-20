import React, { useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Image} from 'react-native-elements';
import {LatoBold, LatoRegular} from './CustomText';

import IconLocation from '../../assets/images/ic_home_location.svg';
import IconCheck from '../../assets/images/ic_check_circle.svg';

import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import { displayProvince, getFullLink, getPostTime } from '../../actions/helper';

const CardContract = ({data, onPress, containerStyle}) => {

  useEffect(() => {
    console.log('datanya', data)
  }, [])
  

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 16}}>
          <Image
            source={{uri: getFullLink(data.company_image)}}
            style={{height: 64, width: undefined, aspectRatio: 1}}
            resizeMode={'center'}
          />
          <View style={{paddingLeft: 16, justifyContent: 'space-between'}}>
            <LatoRegular>{data.sticker_area?.length > 1 ? data.sticker_area.join(', ') : data.sticker_area}</LatoRegular>
            <LatoRegular style={{fontSize: 10}}>{data.company_name}</LatoRegular>
            <LatoRegular
              Icon={IconLocation}
              style={{fontSize: 10, color: Colors.primary}}>
              {displayProvince(data.contract_area)}
            </LatoRegular>
          </View>
        </View>

        {data.vehicles ? (
          <View>
            <Divider />
            <LatoRegular
              Icon={IconCheck}
              containerStyle={{paddingHorizontal: 10, paddingVertical: 8}}
              style={{fontSize: 10, color: Colors.primary}}>
              {data.vehicles.join(', ')}
            </LatoRegular>
            <Divider />
          </View>
        ) : (
          <View>
            <Divider />
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'space-between',
          }}>
          <LatoRegular style={{fontSize: 10, color: Colors.greyLight}}>
            {getPostTime(data.start_date)}
          </LatoRegular>
          <LatoBold
            style={{
              fontSize: 10,
              textDecorationLine: 'underline',
              color: Colors.secondary,
            }}>
            {translate(data.carList ? 'see_this_offer' : 'see_contract')}
          </LatoBold>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardContract;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: 'white',
    elevation: 2,
  },
});
