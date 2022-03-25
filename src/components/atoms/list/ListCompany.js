import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../../../constants/Colors';
import {LatoMedium, LatoRegular, LatoBold} from '../CustomText';

import IconOffice from '../../../assets/images/ic_office.svg';
import IconCheckmark from '../../../assets/images/ic_checkmark.svg';

const ListCompany = ({data, selectedId, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(data.id, data.name)}>
      <View
        style={[
          styles.container,
          {backgroundColor: selectedId == data.id ? '#EEEEFF' : 'white'},
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.22,

    elevation: 3,
  },
});

export default ListCompany;
