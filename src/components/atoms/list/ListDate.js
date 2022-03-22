import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {splitBoxModelStyle} from 'react-native-render-html';
import {View} from 'react-native';
import Colors from '../../../constants/Colors';
import translate from '../../../locales/translate';
import {Headline1, MainTitle, Subtitle2} from '../CustomText';
import moment from 'moment'

const ListDate = ({data, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <Subtitle2 style={{color: Colors.secondText}}>{moment(data.date).format('dddd')}</Subtitle2>
          <Subtitle2 style={{color: Colors.secondText}}>
            {translate('presentation_time')}
          </Subtitle2>
        </View>
        <View style={[styles.flexRow, {marginTop: 2}]}>
          <MainTitle style={{color: Colors.primary}}>{moment(data.date).format('DD MMMM yyyy')}</MainTitle>
          <Subtitle2
            style={{
              fontFamily: 'Lato-Bold',
            }}>{`${data.start} - ${data.end}`}</Subtitle2>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
  flexRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default ListDate;
