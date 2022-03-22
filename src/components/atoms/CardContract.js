import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Image} from 'react-native-elements';
import {LatoBold, LatoRegular} from './CustomText';

import IconLocation from '../../assets/images/ic_home_location.svg';
import IconCheck from '../../assets/images/ic_check_circle.svg';

import Colors from '../../constants/Colors';
import translate from '../../locales/translate';

const CardContract = ({data, onPress, containerStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 16}}>
          <Image
            source={{uri: data.imageUrl}}
            style={{height: 64, width: undefined, aspectRatio: 1}}
            resizeMode={'center'}
          />
          <View style={{paddingLeft: 16, justifyContent: 'space-between'}}>
            <LatoRegular>{data.contractTitle}</LatoRegular>
            <LatoRegular style={{fontSize: 10}}>{data.bankName}</LatoRegular>
            <LatoRegular
              Icon={IconLocation}
              style={{fontSize: 10, color: Colors.primary}}>
              {data.address}
            </LatoRegular>
          </View>
        </View>

        {data.carList ? (
          <View>
            <Divider />
            <LatoRegular
              Icon={IconCheck}
              containerStyle={{paddingHorizontal: 10, paddingVertical: 8}}
              style={{fontSize: 10, color: Colors.primary}}>
              {data.carList}
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
            {data.date}
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
