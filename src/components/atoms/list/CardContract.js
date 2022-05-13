import React, { useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Image} from 'react-native-elements';
import {LatoBold, LatoRegular} from '../CustomText';

import IconLocation from '../../../assets/images/ic_home_location.svg';
import IconCheck from '../../../assets/images/ic_check_circle.svg';

import Colors from '../../../constants/Colors';
import translate from '../../../locales/translate';
import { displayProvince, getFullLink, getPostTime } from '../../../actions/helper';
import StatusTag from '../StatusTag';
import { Shadow } from 'react-native-shadow-2';
import Divider from '../Divider';

const CardContract = ({data, onPress, containerStyle}) => {

  return (
    <View style={containerStyle}>
    <Shadow  radius={10} offset={[0,0]} distance={3} startColor={Colors.divider} viewStyle={[{backgroundColor: 'white', borderRadius: 9, width: '100%'}, ]}>
    <TouchableOpacity onPress={onPress} >
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 16}}>
          <Image
            source={{uri: getFullLink(data.company_image)}}
            style={{height: data.contract_status ? 80 : 60, width: undefined, aspectRatio: 1}}
            resizeMode={'cover'}
          />
          <View style={{paddingLeft: 16, justifyContent: 'space-between'}}>
            <LatoRegular>{data.sticker_area?.length > 1 ? data.sticker_area.join(', ') : data.sticker_area}</LatoRegular>
            <LatoRegular style={{fontSize: 10}}>{data.company_name}</LatoRegular>
            <LatoRegular
              Icon={IconLocation}
              style={{fontSize: 10, color: Colors.primary}}>
              {displayProvince(data.contract_area)}
            </LatoRegular>
            {data.contract_status && <StatusTag text={data.contract_status}/>}
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
            {getPostTime(data.created_at)}
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
    </Shadow>
    </View>
  );
};

export default CardContract;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: 'white',
  },
});
