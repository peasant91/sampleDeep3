import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../../constants/Colors';
import {LatoMedium, LatoRegular, LatoBold} from '../CustomText';

import IconOffice from '../../../assets/images/ic_office.svg';
import IconCheckmark from '../../../assets/images/ic_checkmark.svg';
import { Shadow } from 'react-native-shadow-2';

const ListCompany = ({data, selectedId, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(data.id, data.name)} style={styles.container}>
    <Shadow  radius={10} offset={[0,0]} distance={3} startColor={Colors.divider} viewStyle={[{backgroundColor: selectedId == data.id ? '#EEEEFF' : 'white', borderRadius: 9, width: '100%'}, ]}>
      <View
        style={[
          { flexDirection: 'row', padding: 16},
        ]}>
        <IconOffice />
        <View style={{paddingLeft: 10, flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <LatoBold style={{color: Colors.primary, marginBottom: 5}}>
              {data.name}
            </LatoBold>
            {selectedId == data.id &&
            <IconCheckmark />}
          </View>
          <LatoRegular>{data.address}</LatoRegular>
        </View>
      </View>
      </Shadow>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  }
});

export default ListCompany;
