import React from 'react';
import Colors from '../../../constants/Colors';
import CheckmarkIcon from '../../../assets/images/ic_checkmark_blue.svg';
import {TouchableOpacity, View} from 'react-native';
import {Subtitle2} from '../CustomText';

const ListDivision = ({selectedId, item, onPress}) => {
  const isSelected = () => {
    if (selectedId === item.id) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Subtitle2
            style={[
              {padding: 16},
              isSelected()
                ? {color: Colors.primary}
                : {color: Colors.primaryText},
            ]}>
            {item.name}
          </Subtitle2>
          {isSelected() ? <CheckmarkIcon style={{marginRight: 16}} /> : <View />}
        </View>
        <View style={{height: 1, backgroundColor: Colors.divider}} />
      </View>
    </TouchableOpacity>
  );
};

export default ListDivision;
